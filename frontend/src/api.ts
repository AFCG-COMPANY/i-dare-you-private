import axios from 'axios';
import { User } from './models/user';
import * as firebase from 'firebase';
import { Challenge } from './models/challenge';

const HOST = 'https://us-central1-i-dare-you-142ea.cloudfunctions.net/';

export async function getUserInfo(id: string): Promise<User> {
    const res = await axios.get<User>(`${HOST}profile-getUserInfo?id=${id}`);

    // Need to get download url because we can't do it from backend
    res.data.avatar = await firebase.storage().ref(res.data.avatar).getDownloadURL();

    return res.data;
}

export function setUserInfo(id: string, avatar: string, bio: string, username: string): Promise<void> {
    return axios.post(`${HOST}profile-setUserInfo?id=${id}`, {avatar, bio, username});
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
