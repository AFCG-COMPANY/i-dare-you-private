export interface User {
    id: string;
    username?: string;
    bio?: string;
    avatar?: string;
    avatarBase64?: string;
    wins?: number;
    draws?: number;
    losses?: number;
    vote?: boolean;
    message?: string;
}
