import axios from 'axios';
import * as firebase from 'firebase';
import { Challenge, User } from '../models';

const HOST = 'https://us-central1-i-dare-you-142ea.cloudfunctions.net/';

export async function getUserInfo(id: string): Promise<User> {
    const res = await axios.get<User>(`${HOST}profile-getUserInfo?id=${id}`);
    return res.data;
}

export async function getUserAvatar(id: string): Promise<string> {
    try {
        return await getBase64FileFromStorage('avatars/' + id);
    } catch (error) {
        // If file does not exist, use default avatar
        return await getBase64FileFromStorage('avatars/default.jpeg');
    }
}

export async function getBase64FileFromStorage(path: string): Promise<string> {
    const url = await firebase.storage().ref(path).getDownloadURL();
    const file = await fetch(url);
    const blob = await file.blob();
    return blobToBase64(blob);
}

export async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const base64Str = reader.result;
            resolve(base64Str as string);
        };
    });
}

export function updateUserInfo(user: User): Promise<void> {
    const { username, bio, id } = user;
    return axios.post(`${HOST}profile-setUserInfo?id=${id}`, { bio, username });
}

export function getChallenges(
    userId: string,
    start: number,
    length: number
): Promise<Challenge[]> {
    // TODO call real backend endpoint
    return new Promise<Challenge[]>((resolve, reject) => {
        // TODO This is mock data. Need to use real backend
        const challenges: Challenge[] = [];
        for (let i = start; i < length; i++) {
            challenges.push({
                id: i.toString(),
                title: 'Challenge #' + i
            });
        }

        setTimeout(() => resolve(challenges), 500);
    });
}
