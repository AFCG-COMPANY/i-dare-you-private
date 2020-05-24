import { HOST } from './common';
import { Challenge } from '../models';
import axios from 'axios';

export async function getChallenges(page: number, filterBy?: 'participant' | 'likedBy', userId?: string): Promise<Challenge[]> {
    const params = { page, filterBy, userId };
    const res = await axios.get(`${HOST}challenge-getChallenges`, { params });

    return res.data;
}

export function createChallenge(bid: string, endDate: number, description: string, userId: string): Promise<void> {
    return axios.post(`${HOST}challenge-setChallenge`, {bid, endDate, description, userId});
}

export function setLikedChallenge(challengeId: string, userId: string, like: boolean): Promise<void> {
    return axios.post(`${HOST}challenge-setLiked?id=${challengeId}`, {
        action: like && 'like',
        userId
    });
}
