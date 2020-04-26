// import * as bodyParser from 'body-parser';
import * as functions from 'firebase-functions';

import admin from './config';

export const getUserInfo = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id.toString()).get()
        .then(doc => {
            if (doc.exists) {
                const userInfo = doc.data() || {};
                if (!userInfo.avatar){
                    userInfo.avatar = 'avatars/default.jpeg'
                }
                response.send(userInfo);
            } else {
                response.status(404).send()
            }
        })
        .catch(err => {
            response.status(500).send()
        });
});

// export const setUserInfo = functions.https.onRequest((request, response) => {
//     const userId = request.query.id.toString()

// })