import * as functions from 'firebase-functions';

import admin from './config';


export const setChallenge = functions.https.onRequest(async (request, response) => {
    const user = await (await admin.firestore().collection('users').doc(request.body.id.toString()).get()).data();
    admin.firestore().collection('challenges').add({
        rate: request.body.rate,
        date: admin.firestore.Timestamp.fromMillis(request.body.date),
        description: request.body.description,
        creator: { 'avatar': user?.avatar, 'username': user?.username, 'id': request.body.id.toString() },
        opponents: [],
    })
        .then(doc => {
            response.status(200).send()
        })
        .catch(err => {
            response.status(500).send()
        });
})

export const getChallenges = functions.https.onRequest(async (request, response) => {
    const userId = request.query.userId;
    const liked = request.query.liked;
    let page = parseInt(request.query.page as string) * 10;
    const challengeRef = admin.firestore().collection('challenges');
    const challenges = challengeRef.orderBy('date');

    challenges.get().then(snapshot => {
        let result: { creator: any, date: Date, description: string, rate: string, opponents: any }[] = [];
        snapshot.forEach(challengeDoc => {
            const challengeData = challengeDoc.data() as { creator: any, date: Date, description: string, rate: string, opponents: any };
            if (userId && liked) {
                ;
            }
            else if (userId && !liked) {
                if (challengeData.creator.id === userId) {
                    if (page > 0) {
                        page -= 1;
                    }
                    else {
                        result.push(challengeData)
                    }
                }
            }
            else {
                if (page > 0) {
                    page -= 1;
                }
                else {
                    result.push(challengeData)
                }
            }
        });
        response.status(200).send(result);
    }).catch(e => {
        console.log(e);
        response.status(500).send();
    });
}) 