import React, { Dispatch } from 'react';
import { Challenge, User } from '../models';

export interface AppState {
    user: User | null;
    challenge: Challenge | null;
}

export enum AppActionTypes {
    SetUser,
    SetChallenge
}

export const INITIAL_STATE: AppState = {
    user: null,
    challenge: null
};

export const AppContext = React.createContext<{
    state: AppState;
    dispatch: Dispatch<{ type: AppActionTypes, payload: any }>;
}>({
    state: INITIAL_STATE,
    dispatch: () => INITIAL_STATE
});
