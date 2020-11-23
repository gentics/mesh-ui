import { Injectable } from '@angular/core';
import { ImmutableStateStore, TrackedMethodCall } from 'immutablets';
import { of, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ConfigService } from '../../core/providers/config/config.service';
import { AppState } from '../models/app-state.model';

import { AdminGroupsStateActions } from './admin-groups-state-actions';
import { AdminProjectsStateActions } from './admin-projects-state-actions';
import { AdminRolesStateActions } from './admin-roles-state-actions';
import { AdminSchemasStateActions } from './admin-schemas-state-actions';
import { AdminUsersStateActions } from './admin-users-state-actions';
import { AuthStateActions } from './auth-state-actions';
import { EditorStateActions } from './editor-state-actions';
import { EntityStateActions } from './entity-state-actions';
import { ListStateActions } from './list-state-actions';
import { TagsStateActions } from './tags-state-actions';
import { UIStateActions } from './ui-state-actions';

// TODO: re-enable this rule once immutablets has been updated
// This needs to be a "type" vs "interface" becuase of limitations of mapped types.
/* tslint:disable interface-over-type-literal */
type ActionBranches = {
    adminProjects: AdminProjectsStateActions;
    adminSchemas: AdminSchemasStateActions;
    adminUsers: AdminUsersStateActions;
    adminGroups: AdminGroupsStateActions;
    adminRoles: AdminRolesStateActions;
    auth: AuthStateActions;
    editor: EditorStateActions;
    entity: EntityStateActions;
    list: ListStateActions;
    ui: UIStateActions;
    tag: TagsStateActions;
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

    constructor(config: ConfigService) {
        this.store = new ImmutableStateStore<AppState, ActionBranches>({
            adminProjects: new AdminProjectsStateActions(),
            adminSchemas: new AdminSchemasStateActions(),
            adminUsers: new AdminUsersStateActions(),
            adminGroups: new AdminGroupsStateActions(),
            adminRoles: new AdminRolesStateActions(),
            auth: new AuthStateActions(),
            entity: new EntityStateActions(),
            editor: new EditorStateActions(config),
            list: new ListStateActions(config),
            ui: new UIStateActions(config),
            tag: new TagsStateActions()
        });

        this.actions = this.store.actions;
        this.stateSubject = new BehaviorSubject(this.store.state);
        this.subscription = this.store.observeState(Observable).subscribe(this.stateSubject);
    }

    /** For debugging - Emits all method calls and their state changes. */
    observeMethodCalls(): Observable<TrackedMethodCall<AppState>> {
        return this.store.observeCalls(of() as any);
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
        return this.stateSubject.asObservable().pipe(
            map(selector),
            distinctUntilChanged()
        );
    }

    destroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined as any;
        }
        this.stateSubject.unsubscribe();
    }
}
