import * as functions from 'firebase-functions';

import admin from './config';

const DEFAULT_USER_AVATAR = 'https://firebasestorage.googleapis.com/v0/b/i-dare-you-142ea.appspot.com/o/avatars%2Fdefault.jpeg?alt=media&token=5a6675d3-ada2-43b3-a2b1-edd1487d0459';

export const getUser = functions.https.onRequest(async (request, response) => {
    const usersCollection = admin.firestore().collection('users');
    const docRef = usersCollection.doc(request.query.id!.toString());

    try {
        let userDoc = await docRef.get();
        if (!userDoc.exists) {
            await docRef.set({
                username: '',
                avatar: DEFAULT_USER_AVATAR,
                bio: '',
                wins: 0,
                losses: 0,
                draws: 0
            });

            userDoc = await docRef.get();
        }

        response.send(userDoc.data());
    } catch (e) {
        console.log(e);
        response.status(500).send();
    }
});

export const setUser = functions.https.onRequest((request, response) => {
    admin.firestore().collection('users').doc(request.query.id!.toString()).set({
        username: request.body.username,
        avatar: request.body.avatar,
        bio: request.body.bio,
        userToken: request.body.userToken,
        userStatus: request.body.userStatus,
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

            result.push({
                ...userData,
                id: userDoc.id
            });
        });

        let filterFn = (item: { id: string, username: string, bio: string, avatar: string }) => item.id !== id;
        if (queryText) {
            const lowerCaseQueryText = queryText.toLowerCase();
            filterFn = item => item.id !== id && item.username.toLowerCase().startsWith(lowerCaseQueryText);
        }

        result = result.filter(filterFn);

        response.status(200).send(result);
    }).catch(e => {
        console.log(e);
        response.status(500).send();
    });
})
