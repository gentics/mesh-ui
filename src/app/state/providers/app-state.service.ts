import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export type InternalStateType = {
    loggedIn: boolean;
    currentLanguage: string;
};

/**
 * TODO: This is a toy implementation for getting started. Replace this with a real solution based on immutablets
 */
@Injectable()
export class AppState {

    public _state: InternalStateType = {
        loggedIn: false,
        currentLanguage: 'en'
    };
    public changes$ = new BehaviorSubject(this._state);

    // already return a clone of the current state
    public get state() {
        return this._state = this._clone(this._state);
    }
    // never allow mutation
    public set state(value) {
        throw new Error('do not mutate the `.state` directly');
    }

    public restore(state: InternalStateType): void {
        this._state = state;
        this.changes$.next(this._state);
    }

    public get<T extends keyof InternalStateType>(prop: T): InternalStateType[T];
    public get(): InternalStateType;
    public get<T extends keyof InternalStateType>(prop?: T): InternalStateType[T] | InternalStateType {
        // use our state getter for the clone
        const state = this.state;
        return state.hasOwnProperty(prop) ? state[prop] : state;
    }

    public set(prop: keyof InternalStateType, value: any) {
        // internally mutate our state
        this._state[prop] = value;
        this.changes$.next(this._state);
    }

    private _clone(object: InternalStateType) {
        // simple object clone
        return JSON.parse(JSON.stringify( object ));
    }
}
