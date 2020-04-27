import React, { Dispatch } from 'react';
import { User } from '../models';

export interface AppState {
    user: User | null;
}

export enum AppActionTypes {
    SetUser
}

export const INITIAL_STATE: AppState = { user: null };

export const AppContext = React.createContext<{
    state: AppState;
    dispatch: Dispatch<{ type: AppActionTypes, payload: any }>;
}>({
    state: INITIAL_STATE,
    dispatch: () => INITIAL_STATE
});
