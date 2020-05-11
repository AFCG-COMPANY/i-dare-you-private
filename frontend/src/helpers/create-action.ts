import { Action } from '../models/action';

export function createAction(type: string | number, payload: any): Action {
    return { type, payload };
}
