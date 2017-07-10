import { Injectable } from '@angular/core';
import { ImmutableStateStore, TrackedMethodCall } from 'immutablets';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AdminStateActions } from './admin-state-actions';
import { AppState } from '../models/app-state.model';
import { AuthStateActions } from './auth-state-actions';
import { EditorStateActions } from './editor-state-actions';
import { EntityStateActions } from './entity-state-actions';
import { ListStateActions } from './list-state-actions';
import { UIStateActions } from './ui-state-actions';


// TODO: re-enable this rule once immutablets has been updated
// This needs to be a "type" vs "interface" becuase of limitations of mapped types.
/* tslint:disable interface-over-type-literal */
type ActionBranches = {
    admin: AdminStateActions;
    auth: AuthStateActions;
    editor: EditorStateActions;
    entity: EntityStateActions;
    list: ListStateActions;
    ui: UIStateActions;
};
/* tslint:enable interface-over-type-literal */

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
            admin: new AdminStateActions(),
            auth: new AuthStateActions(),
            entity: new EntityStateActions(),
            editor: new EditorStateActions(),
            list: new ListStateActions(),
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
