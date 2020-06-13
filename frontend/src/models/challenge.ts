import { User } from './user';

export interface Challenge {
    id: string;
    bid: string;
    description: string;
    endDate: number;
    createdBy: User;
    creationDate: number;
    creatorProgress?: number;
    creatorHealth?: number;
    isOpponent: boolean;
    opponents: User[] | string[];
    likedBy: string[]; // Ids of users who liked the challenge
    likedByUser: boolean;
    likesCount: number;
    userVote?: boolean;
    status: ChallengeStatus;
    result?: ChallengeResult;
    commentsCount: number;
    comments?: Comment[];
    commentsChanged?: boolean;
}

export interface Comment {
    user: { username: string, id: string };
    message?: string;
    imageUrl?: string;
}

export enum ChallengeStatus {
    Created = 'Created', // Initial status
    InProgress = 'In Progress', // There is at least 1 opponent
    Voting = 'Voting', // Creator has finished the challenge or the due date is passed
    Finished = 'Finished' // All participants voted or voting phase is over (after 3 days)
}

export enum ChallengeResult {
    Loss,
    Win,
    Draw
}
