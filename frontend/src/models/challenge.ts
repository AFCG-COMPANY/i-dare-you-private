import { User } from './user';

export interface Challenge {
    id: string;
    bid: string;
    description: string;
    endDate: number;
    createdBy: User;
    creationDate: number;
    opponents: string[]; // Ids of creator's opponents
    likedBy: string[]; // Ids of users who liked the challenge
}
