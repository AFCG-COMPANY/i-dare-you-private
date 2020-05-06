import * as functions from 'firebase-functions';

import admin from './config';

const DEFAULT_USER_AVATAR = 'https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/avatars%2Fdefault.jpeg?alt=media&token=5a6675d3-ada2-43b3-a2b1-edd1487d0459';

export const getUser = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id.toString()).get()
        .then(doc => {
            if (doc.exists) {
                response.send(doc.data());
            } else {
                admin.firestore()
                    .collection('users')
                    .doc(request.query.id.toString())
                    .set({
                        username: '',
                        avatar: DEFAULT_USER_AVATAR,
                        bio: '',
                        wins: 0,
                        losses: 0,
                        draws: 0
                    })
                    .then(() => response.status(200).send())
                    .catch(() => response.status(500).send());
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
    const { id, queryText } = request.query as { id: string, queryText: string };

    if (!id) {
        response.status(400).send();
    }

    const usersRef = admin.firestore().collection('users');
    const users = usersRef.orderBy('username');

    users.get().then(snapshot => {
        let result: { id: string, username: string, bio: string, avatar: string }[] = [];

        snapshot.forEach(userDoc => {
            const userData = userDoc.data() as { id: string, username: string, bio: string, avatar: string };

            if (userDoc.id !== id) {
                result.push({
                    ...userData,
                    id: userDoc.id
                });
            }
        });

        let filterFn = (item: { id: string, username: string, bio: string, avatar: string }) => item.id !== id;
        if (queryText) {
            filterFn = item => item.id !== id && item.username.toLowerCase().startsWith(queryText);
        }

        result = result.filter(filterFn);

        response.status(200).send(result);
    }).catch(e => {
        console.log(e);
        response.status(500).send();
    });
}) 
