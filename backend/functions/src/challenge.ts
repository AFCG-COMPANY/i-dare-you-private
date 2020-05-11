import * as functions from 'firebase-functions';

import admin from './config';


export const setChallenge = functions.https.onRequest((request, response) => {
    admin.firestore().collection('challenges').add({
        rate: request.body.rate,
        date: admin.firestore.Timestamp.fromMillis(request.body.date),
        description: request.body.description,
        creatorId: request.body.id,
    })
        .then(doc => {
            response.status(200).send()
        })
        .catch(err => {
            response.status(500).send()
        });
})