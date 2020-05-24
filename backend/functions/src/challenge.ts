import * as functions from 'firebase-functions';
import admin from './config';

interface User {
    id: string;
    avatar: string;
    username: string;
}

interface Challenge {
    bid: string;
    description: string;
    endDate: number;
    createdBy: string;
    creationDate: number;
    opponents: string[]; // Ids of creator's opponents
    likedBy: string[]; // Ids of users who liked the challenge
    challengeStatus: string,
    challengeResult: number,
}

export const setChallenge = functions.https.onRequest(async (request, response) => {

    admin.firestore().collection('challenges')
        .add(<Challenge>{
            bid: request.body.bid,
            endDate: request.body.endDate,
            description: request.body.description,
            createdBy: request.body.userId as string,
            creationDate: Date.now(),
            opponents: [],
            likedBy: [],
            challengeStatus: 'Created',
            challengeResult: 0,
        })
        .then(doc => {
            response.status(200).send();
        })
        .then(doc => response.status(200).send())
        .catch(e => {
            console.log(e);
            response.status(500).send();
        });
});

export const setOpponent = functions.https.onRequest(async (request, response) => {
    admin.firestore().collection('challenges').doc(request.query.id.toString()).update({
        opponents: admin.firestore.FieldValue.arrayUnion(request.body.userId)
    })
        .then(doc => {
            response.status(200).send()
        })
        .catch(err => {
            response.status(500).send()
        });
})

export const setLiked = functions.https.onRequest(async (request, response) => {
    let databaseAction;
    if (request.body.action === 'like') {
        databaseAction = admin.firestore.FieldValue.arrayUnion(request.body.userId)
    }
    else {
        databaseAction = admin.firestore.FieldValue.arrayRemove(request.body.userId)
    }
    admin.firestore().collection('challenges').doc(request.query.id.toString()).update({
        likedBy: databaseAction
    })
        .then(doc => {
            response.status(200).send()
        })
        .catch(err => {
            console.log(err)
            response.status(500).send()
        });
})

const CHALLENGES_PER_PAGE: number = 10;

const extendChallenges = async (challenges: any, userId: string) => {
    const users: { [id: string]: User | {} } = {};
    for (const challenge of challenges) {
        users[challenge.createdBy] = {}
        for (const opponent of challenge.opponents) {
            users[opponent] = {}
        }
    }
    const usersCollection = admin.firestore().collection('users');
    await usersCollection.where(admin.firestore.FieldPath.documentId(), 'in', Object.keys(users))
        .get().then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                users[documentSnapshot.id] = {id: `${documentSnapshot.id}`, ...documentSnapshot.data()};
            });
        })
    const extendedChallenges = challenges.map((challenge: any) => {
        return {
            ...challenge,
            likedByUser: challenge.likedBy.includes(userId),
            createdBy: users[challenge.createdBy],
            opponents: challenge.opponents.map((opponent: string) => {
                return users[opponent];
            })
        }
    });
    return extendedChallenges;
}

export const getChallenges = functions.https.onRequest(async (request, response) => {
    const { filterBy, userId } = request.query;

    if (!request.query.page) {
        response.status(400).send('You must specify the page.');
        return;
    }

    const page = parseInt(<string>request.query.page, 10);

    // != null is check for undefined or null
    if (!isNaN(page) && page > -1) {
        const offset = page * CHALLENGES_PER_PAGE;
        const challengesRef = admin.firestore().collection('challenges');

        let challenges;
        if (filterBy && userId) {
            if (filterBy === 'participant') {
                const createdChallenges = await challengesRef.where('createdBy.id', '==', userId).get();
                const participatingChallenges = await challengesRef.where('opponents', 'array-contains', userId).get();

                // Merge matching challenges
                const result = createdChallenges.docs
                    .concat(participatingChallenges.docs)
                    // Sort by creation date
                    .sort((a, b) => (b.createTime.toMillis() - a.createTime.toMillis()))
                    .slice(offset, offset + CHALLENGES_PER_PAGE);

                response.send(await extendChallenges(result.map(doc => ({ ...doc.data(), id: doc.id })), userId as string));
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
                response.send(await extendChallenges(result.docs.map(doc => ({ ...doc.data(), id: doc.id })), userId as string));
            }
            else{
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
