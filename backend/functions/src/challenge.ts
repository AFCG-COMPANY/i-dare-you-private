import * as functions from 'firebase-functions';

import admin from './config';

interface Challenge {
    bid: string;
    description: string;
    endDate: number;
    creator: any;
    creationDate: number;
    opponents: string[]; // Ids of creator's opponents
    likedBy: string[]; // Ids of users who liked the challenge
}

export const setChallenge = functions.https.onRequest(async (request, response) => {
    const user = await (await admin.firestore().collection('users').doc(request.body.id.toString()).get()).data();

    admin.firestore().collection('challenges')
        .add(<Challenge>{
            bid: request.body.rate,
            endDate: request.body.endDate,
            description: request.body.description,
            creator: { avatar: user?.avatar, username: user?.username, id: request.body.id.toString() },
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

interface ChallengesFilterModel {
    participant?: string;
    likedBy?: string;
}

interface GetChallengesQuery {
    page: number;
    filters: ChallengesFilterModel;
}

const CHALLENGES_PER_PAGE: number = 10;

export const getChallenges = functions.https.onRequest(async (request, response) => {
    const query = <unknown>request.query as GetChallengesQuery;
    const { page, filters } = query;

    if (!page) {
        response.status(400).send('You must specify the page.');
    }

    const challengesRef = admin.firestore().collection('challenges');

    let challenges;
    if (filters) {
        if (filters.participant) {
            const createdChallenges = await challengesRef.where('creator.id', '==', filters.participant).get();
            const participatingChallenges = await challengesRef.where('opponents', 'array-contains', filters.participant).get();

            // Merge matching challenges
            const result = createdChallenges.docs
                .concat(participatingChallenges.docs)
                // Sort by creation date
                .sort((a, b) => (b.createTime.toMillis() - a.createTime.toMillis()));

            response.send(result);
            return;

        } else if (filters.likedBy) {
            challenges = challengesRef.where('likedBy', 'array-contains', filters.likedBy);
        }
    }

    challenges = (challenges || challengesRef)
        // Sort by creation date
        .orderBy('creationDate', 'desc')
        // Get challenges for the current page
        .offset(page * CHALLENGES_PER_PAGE)
        .limit(CHALLENGES_PER_PAGE);

    // Send the response
    try {
        const result = await challenges.get();
        response.send(result.docs);
    } catch (e) {
        console.log(e);
        response.status(500).send();
    }
});
