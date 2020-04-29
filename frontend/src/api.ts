import axios from 'axios';
import { User, Challenge } from './models';
import * as firebase from 'firebase';

const HOST = 'https://us-central1-i-dare-you-142ea.cloudfunctions.net/';

export async function getUserInfo(id: string): Promise<User> {
    const res = await axios.get<User>(`${HOST}profile-getUserInfo?id=${id}`);

    // Need to get download url because we can't do it from backend
    try {
        res.data.avatar = await firebase.storage().ref(res.data.avatar).getDownloadURL();
    } catch (e) {
        console.log(e);
    }

    return res.data;
}

export function updateUserInfo(user: User): Promise<void> {
    const { username, bio, id } = user;
    return axios.post(`${HOST}profile-setUserInfo?id=${id}`, {avatar: '', bio, username});
}


export function getChallenges(userId: string, start: number, length: number): Promise<Challenge[]> {
    // TODO call real backend endpoint
    return new Promise<Challenge[]>((resolve, reject) => {

        // TODO This is mock data. Need to use real backend
        const challenges: Challenge[] = [];
        for (let i = start; i < length; i++) {
            challenges.push({
                id: i.toString(),
                title: 'Challenge #' + i
            })
        }

        setTimeout(() => resolve(challenges), 500);
    });
}
