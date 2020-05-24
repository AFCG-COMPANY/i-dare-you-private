import { User } from './user';

export interface Challenge {
    id: string;
    bid: string;
    description: string;
    endDate: number;
    createdBy: User;
    creationDate: number;
    opponents: User[] | string[];
    likedBy: string[]; // Ids of users who liked the challenge
    likedByUser: boolean;
    likesCount: number;
    status: ChallengeStatus;
    result?: ChallengeResult;
}

export enum ChallengeStatus {
    Created = 'Created', // Initial status
    InProgress = 'In Progress', // There is at least 1 opponent
    Voting = 'Voting', // Creator has finished the challenge or the due date is passed
    Finished = 'Finished' // All participants voted or voting phase is over (after 3 days)
}

export enum ChallengeResult {
    Loss,
    Win
}
