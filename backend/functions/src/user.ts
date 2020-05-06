import * as functions from 'firebase-functions';

import admin from './config';

const DEFAULT_USER_AVATAR = 'https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/avatars%2Fdefault.jpeg?alt=media&token=5a6675d3-ada2-43b3-a2b1-edd1487d0459';

export const getUser = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id.toString()).get()
        .then(doc => {
            if (doc.exists) {
                response.send(doc.data());
            } else {
                admin.firestore().collection('users').doc(request.query.id.toString()).set({
                    username: '',
                    avatar: DEFAULT_USER_AVATAR,
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

export const setUser = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id.toString()).set({
        username: request.body.username,
        avatar: request.body.avatar,
        bio: request.body.bio
    })
        .then(doc => {
            response.status(200).send()
        })
        .catch(err => {
            response.status(500).send()
        });
})

export const getUsers = functions.https.onRequest((request, response) => {
    const { id, queryText } = request.query;

    if (id && queryText != null) {
        const usersRef = admin.firestore().collection('users');
        const users = usersRef.orderBy('username').where('username', '>=', queryText);

        users.get().then(snapshot => {
            const result: {}[] = [];

            snapshot.forEach(userDoc => {
                const userData = userDoc.data();

                result.push({
                    ...userData,
                    id: userDoc.id
                });
            });

            response.status(200).send(result);
        }).catch(e => {
            console.log(e);
            response.status(500).send();
        });
    } else {
        response.status(400).send();
    }
}) 
