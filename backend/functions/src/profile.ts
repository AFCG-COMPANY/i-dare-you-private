import * as functions from 'firebase-functions';
import db from './config';

export const getUserInfo = functions.https.onRequest((request, response) => {
    console.log(request.query.id);
    db.collection('users').doc(request.query.id.toString()).get()
        .then(doc => {
            if (doc.exists) {
                response.send(doc.data())
            } else {
                response.status(404).send()
            }
        })
        .catch(err => {
            response.status(500).send()
        });
});