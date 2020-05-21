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
    createdBy: User;
    creationDate: number;
    opponents: string[]; // Ids of creator's opponents
    likedBy: string[]; // Ids of users who liked the challenge
}

export const setChallenge = functions.https.onRequest(async (request, response) => {
    const userDoc = await admin.firestore().collection('users').doc(request.body.userId).get();
    const user = await userDoc.data();

    admin.firestore().collection('challenges')
        .add(<Challenge>{
            bid: request.body.bid,
            endDate: request.body.endDate,
            description: request.body.description,
            createdBy: {
                avatar: user?.avatar,
                username: user?.username,
                id: request.body.userId as string
            },
            creationDate: Date.now(),
            opponents: [],
            likedBy: []
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

const CHALLENGES_PER_PAGE: number = 10;

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

                response.send(result.map(doc => ({...doc.data(), id: doc.id})));
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
            response.send(result.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } catch (e) {
            console.log(e);
            response.status(500).send();
        }
    } else {
        response.status(400).send('Invalid page format. Page must be an integer value.');
    }
});
