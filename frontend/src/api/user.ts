import axios from 'axios';
import * as firebase from 'firebase';
import { HOST } from './common';
import { User } from '../models';

export async function getUsers(queryText: string, userId: string): Promise<User[]> {
    const res = await axios.get<User[]>(`${HOST}user-getUsers`, {
        params: {
            id: userId,
            queryText
        }
    });
    return res.data;
}

export async function getUser(id: string): Promise<User> {
    const res = await axios.get<User>(`${HOST}user-getUser`, {
        params: {
            id
        }
    });
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

export function updateUser(user: User): Promise<void> {
    const { username, bio, id, avatar } = user;
    return axios.post(`${HOST}user-setUser?id=${id}`, { bio, username, avatar });
}
