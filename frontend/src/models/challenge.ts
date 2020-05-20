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
}
