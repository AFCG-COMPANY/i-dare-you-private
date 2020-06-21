import { HOST } from './common';
import { Challenge } from '../models';
import axios from 'axios';
import { Comment } from '../models/challenge';

export async function getChallenges(
    currentUserId: string,
    page: number,
    filterBy?: 'participant' | 'likedBy',
    userId?: string
): Promise<any[]> {
    const params = { page, filterBy, userId, currentUserId };
    const res = await axios.get(`${HOST}challenge-getChallenges`, { params });
    console.log(res.data);
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

export function setChallengeOpponent(challengeId: string, opponentId: string, bid: string): Promise<void> {
    return axios.post(HOST + 'challenge-setOpponent',
    {
        id: opponentId,
        message: bid
    },
    {
        params: { id: challengeId }
    });
}

export function setChallengeProgress(challengeId: string, progress: number): Promise<void> {
    return axios.post(
        HOST + 'challenge-setCreatorProgress',
        { creatorProgress: progress },
        { params: { id: challengeId }
    })
}

export function endChallenge(challengeId: string): Promise<void> {
    return axios.get(
        HOST + 'challenge-setChallengeStatusToVoting',
        { params: { id: challengeId } }
    );
}

/**
 * @param challengeId - id of the challenge voting on
 * @param userId - id of the current user (who is voting)
 * @param vote - true, if goal achieved, false otherwise
 */
export function voteOnChallenge(challengeId: string, userId: string, vote: boolean): Promise<void> {
    return axios.post(
        HOST + 'challenge-setVote',
        { userId, vote },
        { params: { id: challengeId } }
    )
}

export function commentOnChallenge(
    challengeId: string,
    user: { username: string, id: string },
    message?: string,
    imageUrl?: string
): Promise<void> {
    return axios.post(
        HOST + 'challenge-setComment',
        { user, message, imageUrl },
        { params: { id: challengeId } }
    );
}

export async function getChallengeComments(challengeId: string): Promise<Comment[]> {
    const res = await axios.get(HOST + 'challenge-getComments', { params: { id: challengeId } });
    return res.data;
}
