import * as functions from 'firebase-functions';
import admin from './config';

interface User {
    id: string;
    avatar: string;
    username: string;
}

enum ChallengeStatus {
    Created = 'Created', // Initial status
    InProgress = 'In Progress', // There is at least 1 opponent
    Voting = 'Voting', // Creator has finished the challenge or the due date is passed
    Finished = 'Finished' // All participants voted or voting phase is over (after 3 days)
}

enum ChallengeResult {
    Loss,
    Win,
    Draw
}

interface Challenge {
    id?: string;
    bid: string;
    description: string;
    endDate: number;
    creatorHealth?: number;
    creatorProgress: number;
    createdBy: string;
    creatorVote?: boolean; // creator opinion about challenge result, true if goal achieved
    creationDate: number;
    isOpponent?: boolean;
    opponents: { [id: string]: {} }; // creator's opponents
    _opponents: string[]; // field for search
    likedBy: string[]; // Ids of users who liked the challenge
    status: ChallengeStatus,
    result?: ChallengeResult,
    likedByUser?: boolean;
    userVote?: boolean;
}

export const setChallenge = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges')
        .add({
            bid: request.body.bid,
            endDate: request.body.endDate,
            description: request.body.description,
            createdBy: request.body.userId as string,
            creationDate: Date.now(),
            creatorProgress: 0,
            opponents: {},
            _opponents: [],
            likedBy: [],
            status: ChallengeStatus.Created
        } as Challenge)
        .then(() => response.status(200).send())
        .catch(e => {
            console.log(e);
            response.status(500).send();
        });
});

export const setOpponent = functions.https.onRequest(async (request, response) => {
    const update: { [id: string]: {} } = {};
    update[`opponents.${request.body.id}`] = { message: request.body.message }
    update['_opponents'] = admin.firestore.FieldValue.arrayUnion(request.body.id);
    update['status'] = ChallengeStatus.InProgress;
    admin.firestore()
        .collection('challenges')
        .doc(request.query.id.toString())
        .update(update)
        .then(() => response.status(200).send())
        .catch(() => response.status(500).send());
})

export const setVote = functions.https.onRequest(async (request, response) => {
    const challengeId: string = request.query.id.toString();
    const { userId, vote } = request.body;
    const update: { [id: string]: string } = {};

    const challengesCollection = admin.firestore().collection('challenges');
    const challengeDocRef = challengesCollection.doc(challengeId);
    const challenge = await (await challengeDocRef.get()).data();

    if (challenge?.createdBy === userId) {
        update.creatorVote = vote;
    } else {
        update[`opponents.${userId}.vote`] = vote;
    }

    challengeDocRef
        .update(update)
        .then(() => response.status(200).send())
        .catch(() => response.status(500).send());
})

export const setCreatorProgress = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges')
        .doc(request.query.id.toString())
        .update({ creatorProgress: parseInt(request.body.creatorProgress) })
        .then(() => response.status(200).send())
        .catch(() => response.status(500).send());
})

export const setChallengeStatusToVoting = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges')
        .doc(request.query.id.toString())
        .update({ status: ChallengeStatus.Voting })
        .then(() => response.status(200).send())
        .catch(() => response.status(500).send());
})

export const setLiked = functions.https.onRequest(async (request, response) => {
    let databaseAction;
    if (request.body.action === 'like') {
        databaseAction = admin.firestore.FieldValue.arrayUnion(request.body.userId)
    } else {
        databaseAction = admin.firestore.FieldValue.arrayRemove(request.body.userId)
    }

    admin.firestore()
        .collection('challenges')
        .doc(request.query.id.toString())
        .update({ likedBy: databaseAction })
        .then(() => response.status(200).send())
        .catch(err => {
            console.log(err)
            response.status(500).send()
        });
})

const CHALLENGES_PER_PAGE: number = 10;

const extendChallenges = async (challenges: Challenge[], currentUserId: string) => {
    const users: { [id: string]: User | {} } = {};
    for (const challenge of challenges) {
        users[challenge.createdBy] = {};
        for (const opponentId of Object.keys(challenge.opponents)) {
            users[opponentId] = challenge.opponents[opponentId];
        }
    }

    const usersKeys = Object.keys(users);
    await admin.firestore()
        .collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', usersKeys)
        .get()
        .then(querySnapshot => querySnapshot.forEach(documentSnapshot => {
            users[documentSnapshot.id] = {
                id: `${documentSnapshot.id}`,
                ...documentSnapshot.data(),
                ...users[documentSnapshot.id]
            };
        }));

    return challenges.map((challenge: Challenge) => ({
        ...challenge,
        userVote: getUserVote(challenge, currentUserId),
        creatorHealth: getCreatorHealth(challenge.endDate, challenge.creationDate),
        isOpponent: Object.keys(challenge.opponents).includes(currentUserId),
        likedByUser: challenge.likedBy.includes(currentUserId),
        createdBy: users[challenge.createdBy],
        opponents: Object.keys(challenge.opponents).map((opponent: string) => users[opponent])
    }));
}

const getCreatorHealth = (endDate : number, creationDate : number) => {
    const health = (endDate - Date.now())/(endDate - creationDate) * 100;
    if (health < 0) {
        return 0;
    }
    return Math.round(health);
}

const getUserVote = (challenge: any, currentUserId: string) => {
    if (challenge.createdBy === currentUserId) {
        return challenge.creatorVote;
    } else {
        const currentUser = challenge.opponents[currentUserId];
        return currentUser ? currentUser.vote : null;
    }
}

export const getChallenges = functions.https.onRequest(async (request, response) => {
    const { filterBy, userId, currentUserId } = request.query;

    if (!request.query.page) {
        response.status(400).send('You must specify the page.');
        return;
    }

    const page = parseInt(<string>request.query.page, 10);

    if (!isNaN(page) && page > -1) {
        const offset = page * CHALLENGES_PER_PAGE;
        const challengesRef = admin.firestore().collection('challenges');

        let challenges;
        if (filterBy && userId) {
            if (filterBy === 'participant') {
                const createdChallenges = await challengesRef.where('createdBy', '==', userId).get();
                const participatingChallenges = await challengesRef.where('_opponents', 'array-contains', userId).get();

                // Merge matching challenges
                const result = createdChallenges.docs
                    .concat(participatingChallenges.docs)
                    // Sort by creation date
                    .sort((a, b) => (b.createTime.toMillis() - a.createTime.toMillis()))
                    .slice(offset, offset + CHALLENGES_PER_PAGE)
                    .map(doc => ({ ...doc.data(), id: doc.id } as Challenge));

                response.send(result.length > 0 ? await extendChallenges(result, currentUserId as string) : result);
                return;

            } else if (filterBy === 'likedBy') {
                challenges = challengesRef.where('likedBy', 'array-contains', userId);
            }
        }

        challenges = (challenges || challengesRef)
            // Sort by creation date
            .orderBy('creationDate', 'desc')
            // Get challenges for the current page
            .offset(offset)
            .limit(CHALLENGES_PER_PAGE);

        // Send the response
        try {
            const result = await challenges.get();
            if (result.docs.length > 0) {
                response.send(
                    await extendChallenges(
                        result.docs.map(doc => ({ ...doc.data(), id: doc.id } as Challenge)),
                        currentUserId as string
                    ));
            }
            else {
                response.send([])
            }
        } catch (e) {
            console.log(e);
            response.status(500).send();
        }
    } else {
        response.status(400).send('Invalid page format. Page must be an integer value.');
    }
});

export const setComment = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges')
        .doc(request.query.id.toString())
        .collection('comments').add({
            message: request.body.message !== undefined ? request.body.message : null,
            image: request.body.image !== undefined ? request.body.image : null,
        })
        .then(() => response.status(200).send())
        .catch(() => response.status(500).send());
})

export const getComments = functions.https.onRequest(async (request, response) => {
    const commentsSnapshot = await admin.firestore()
        .collection('challenges')
        .doc(request.query.id.toString())
        .collection('comments')
        .get();

    response.status(200).send(commentsSnapshot.docs.map(doc => doc.data()));
})
