import * as functions from 'firebase-functions';
import admin from './config';

import { updateStatuses, getChallengeResult, sendPushes, getChallengeCreatorToken } from './utils';

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

export enum ChallengeResult {
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
    creatorEndChallenge: boolean;
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
    commentsCount: number;
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
            creatorEndChallenge: false,
            opponents: {},
            _opponents: [],
            likedBy: [],
            status: ChallengeStatus.Created,
            commentsCount: 0,
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
        .doc(request.query.id!.toString())
        .update(update)
        .then(async () => {
            response.status(200).send();
            const creatorId = await getChallengeCreatorToken(request.query.id!.toString());
            sendPushes(creatorId, 'Новый оппонент в вашем споре!', request.body.message);
        })
        .catch(() => response.status(500).send());
})

export const setVote = functions.https.onRequest(async (request, response) => {
    const challengeId: string = request.query.id!.toString();
    const { userId, vote } = request.body;
    const update: { [id: string]: string } = {};

    const challengesCollection = admin.firestore().collection('challenges');
    const challengeDocRef = challengesCollection.doc(challengeId);
    const challenge = await (await challengeDocRef.get()).data();
    console.log(challenge)
    if (challenge!.createdBy === userId) {
        update.creatorVote = vote;
        challenge!.creatorVote = vote;
    } else {
        update[`opponents.${userId}.vote`] = vote;
        challenge!.opponents[userId].vote = vote;
    }

    await challengeDocRef.update(update);
    response.status(200).send({ 'result': getChallengeResult(challenge) });
})

export const setCreatorProgress = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges')
        .doc(request.query.id!.toString())
        .update({ creatorProgress: parseInt(request.body.creatorProgress) })
        .then(() => response.status(200).send())
        .catch(() => response.status(500).send());
})

export const setChallengeStatusToVoting = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges')
        .doc(request.query.id!.toString())
        .update({ creatorEndChallenge: true })
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
        .doc(request.query.id!.toString())
        .update({ likedBy: databaseAction })
        .then(() => response.status(200).send())
        .catch(err => {
            console.log(err)
            response.status(500).send()
        });
})

const CHALLENGES_PER_PAGE: number = 2;

const extendChallenges = async (challenges: Challenge[], currentUserId: string) => {
    const users: { [id: string]: User | {} } = {};
    for (const challenge of challenges) {
        users[challenge.createdBy] = {};
        for (const opponentId of Object.keys(challenge.opponents)) {
            users[opponentId] = challenge.opponents[opponentId];
        }
    }
    console.log(users);
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
        status: getChallengeStatus(challenge),
        userVote: getUserVote(challenge, currentUserId),
        creatorHealth: getCreatorHealth(challenge.endDate, challenge.creationDate),
        isOpponent: Object.keys(challenge.opponents).includes(currentUserId),
        likedByUser: challenge.likedBy.includes(currentUserId),
        createdBy: users[challenge.createdBy],
        opponents: setOpponents(challenge, users)
    }));
}

const setOpponents = (challenge : any, users: any) => {
    const result = []
    for (let [key, value] of Object.entries(challenge.opponents) as any) {
        console.log(`${key}: ${value}`);
        const opponentMessage = value.message;
        result.push({
            ...users[key],
            message: opponentMessage
        })
      }
    return result;
}

const getCreatorHealth = (endDate: number, creationDate: number) => {
    if (Date.now() > endDate) {
        return 0;
    }
    const health = (endDate - Date.now()) / (endDate - creationDate) * 100;
    return health < 0 ? 0 : Math.round(health);
}

const VOTING_TIMEOUT = 259200000;
const getChallengeStatus = (challenge: Challenge) => {
    if (Date.now() - challenge.endDate > VOTING_TIMEOUT) {
        return ChallengeStatus.Finished
    }
    return challenge.status || ChallengeStatus.Created;
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
    let batch = admin.firestore().batch();
    let newComment = admin.firestore().collection('challenges').doc(request.query.id!.toString())
        .collection('comments').doc();

    batch.set(newComment, {
        message: request.body.message || null,
        imageUrl: request.body.imageUrl || null,
        user: request.body.user,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    let challenge = admin.firestore().collection('challenges').doc(request.query.id!.toString())
    const increment = admin.firestore.FieldValue.increment(1);
    batch.update(challenge, { commentsCount: increment })

    batch.commit()
        .then(async () => {
            response.status(200).send();
            const creatorId = await getChallengeCreatorToken(request.query.id!.toString());
            sendPushes(creatorId, 'Новый комментарий в вашем споре!', request.body.message);
        })
        .catch(() => response.status(500).send());
})

export const getComments = functions.https.onRequest(async (request, response) => {
    const commentsSnapshot = await admin.firestore()
        .collection('challenges')
        .doc(request.query.id!.toString())
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .get();

    response.status(200).send(commentsSnapshot.docs.map(doc => doc.data()));
})


export const setChallengesStatus = functions.https.onRequest(async (request, response) => {
    admin.firestore()
        .collection('challenges').where('status', 'in', ['Created', 'In Progress', 'Voting']).get().then(
            snapshot => {
                if (snapshot.empty){
                    console.log('No matching documents.');
                    return;
                }
                console.log("There are "+snapshot.size+" messages");
                snapshot.forEach(async (doc) => {
                    await updateStatuses(doc)
                })
            }
        ).catch();
    response.status(200).send()
})