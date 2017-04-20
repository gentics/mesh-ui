import { Injectable } from '@angular/core';
import { ImmutableStateStore, TrackedMethodCall } from 'immutablets';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { AppState } from '../models/app-state.model';
import { AuthStateActions } from './auth-state-actions';
import { UIStateActions } from './ui-state-actions';


type ActionBranches = {
    auth: AuthStateActions;
    ui: UIStateActions;
};

@Injectable()
export class ApplicationStateService {

    /** Get the current application state object. */
    get now(): AppState {
        return this.stateSubject.value;
    }

    /** Actions that can change the application state. */
    readonly actions: ActionBranches;

    protected store: ImmutableStateStore<AppState, ActionBranches>;
    private stateSubject: BehaviorSubject<AppState>;
    private subscription: Subscription;

    constructor() {
        this.store = new ImmutableStateStore<AppState, ActionBranches>({
            auth: new AuthStateActions(),
            ui: new UIStateActions()
        });

        this.actions = this.store.actions;
        this.stateSubject = new BehaviorSubject(this.store.state);
        this.subscription = this.store.observeState(Observable).subscribe(this.stateSubject);
    }

    /** For debugging - Emits all method calls and their state changes. */
    observeMethodCalls(): Observable<TrackedMethodCall<AppState>> {
        return this.store.observeCalls(Observable);
    }

    /** Used for hot module reloading - fully restores a previous app state */
    restore(stateToRestore: AppState): void {
        this.store.replaceState(stateToRestore);
    }

    /**
     * Returns a stream of the state tree mapped by the passed selector function.
     * Emits the current value of the app state at that branch and every time the mapped value changes.
     * If the mapped value did not change during an action, no values are emitted.
     */
    select<R>(selector: (state: AppState) => R): Observable<R> {
        return this.stateSubject
            .asObservable()
            .map(selector)
            .distinctUntilChanged();
    }

    destroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined as any;
        }
        this.stateSubject.unsubscribe();
    }
}
