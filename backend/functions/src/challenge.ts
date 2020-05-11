import * as functions from 'firebase-functions';

import admin from './config';


export const setChallenge = functions.https.onRequest((request, response) => {
    admin.firestore().collection('challenges').doc(create_UUID()).set({
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


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}