import { Action } from '../models/action';

export function createAction<T>(type: T, payload?: any): Action<T> {
    return { type, payload };
}
