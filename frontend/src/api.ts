import axios, { AxiosResponse } from 'axios';
import { User } from './models/user';
import * as firebase from 'firebase';

const HOST = 'https://us-central1-i-dare-you-142ea.cloudfunctions.net/';

export async function getUserInfo(id: string): Promise<AxiosResponse<User>> {
    const res = await axios.get<User>(`${HOST}profile-getUserInfo?id=${id}`);

    // Need to get download url because we can't do it from backend
    res.data.avatar = await firebase.storage().ref(res.data.avatar).getDownloadURL();

    return res.data;
}

export function setUserInfo(userInfo: User): Promise<void> {
    return axios.post(`${HOST}profile-setUserInfo`, userInfo);
}
