import { HOST } from './common';
import { Challenge } from '../models';
import axios from 'axios';

export function getChallenges(): Challenge[] {
    return [];
}

export function createChallenge(bid: string, endDate: number, description: string, id: string) {
    return axios.post(`${HOST}challenge-setChallenge`, {bid, endDate, description, id});
}

export function getMockedChallenges(
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
