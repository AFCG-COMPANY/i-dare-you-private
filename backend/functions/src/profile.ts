import * as functions from 'firebase-functions';

import admin from './config';

export const getUserInfo = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id.toString()).get()
        .then(doc => {
            if (doc.exists) {
                response.send(doc.data());
            } else {
                admin.firestore().collection('users').doc(request.query.id.toString()).set({
                    avatar: 'avatars/default.jpeg',
                    username: '',
                    bio: ''
                })
                .then(() => {
                    response.status(200).send()
                })
                .catch(() => {
                    response.status(500).send()
                });
            }
        })
        .catch(err => {
            response.status(500).send()
        });
});

export const setUserInfo = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id.toString()).set({
        avatar: request.body.avatar,
        username: request.body.username,
        bio: request.body.bio
    })
        .then(doc => {
            response.status(200).send()
        })
        .catch(err => {
            response.status(500).send()
        });

})