import { Injectable } from '@angular/core';
import { deepApplyWithReuse, Immutable, StateActionBranch } from 'immutablets';
import { EntityState } from '../models/entity-state.model';
import { AppState } from '../models/app-state.model';

@Injectable()
@Immutable()
export class EntityStateActions extends StateActionBranch<AppState> {
    private entities: EntityState;

    constructor() {
        super({
            uses: 'entities',
            initialState: {
                entities: {
                    project: {},
                    node: {},
                    user: {},
                    schema: {},
                    microschema: {}
                }
            }
        });
    }
}


type EntityBranchChanges<K extends keyof EntityState> = { [uuid: string]: Partial<EntityState[K][string]> } | Array<Partial<EntityState[K][string]>>;

/**
 * Utility function to update the entity state.
 *
 * Returns a new entity state with the passed changes applied.
 * Reuses references of objects whenever possible.
 * Arrays are not merged, and only reuse references of their elements when they are equal.
 */
export function mergeEntityState(oldState: EntityState, changes: {[K in keyof EntityState]?: EntityBranchChanges<K>}): EntityState {
    const newState = Object.assign({}, oldState);
    let anyBranchChanged = false;

    for (const key of Object.keys(changes)) {
        if (!oldState[key]) {
            throw new Error(`mergeEntityState: Trying to merge nonexisting entity key "${key}"`);
        }
        const branch = mergeEntityStateBranch(oldState[key], changes[key]);
        if (branch !== oldState[key]) {
            newState[key] = branch;
            anyBranchChanged = true;
        }
    }

    return anyBranchChanged ? newState : oldState;
}

/**
 * Merge an entity branch with a set of changes.
 * Reuses references of unchanged objects.
 */
function mergeEntityStateBranch<B extends keyof EntityState>(oldBranch: EntityState[B], changes: EntityBranchChanges<B>): EntityState[B] {
    const newBranch = Object.assign({}, oldBranch);
    let anyEntityChanged = false;

    // Changes can be an array or an object.
    if (Array.isArray(changes)) {
        for (const change of changes) {
            const uuid: string = change && (change as any).uuid;
            if (!uuid) {
                throw new Error(`mergeEntityState: Provided value has no uuid. ` + JSON.stringify(change, null, 4));
            }

            // const entity = mergeEntity(oldBranch[uuid], change);
            const entity = deepApplyWithReuse(oldBranch[uuid], change);
            if (entity !== oldBranch[uuid]) {
                newBranch[uuid] = entity;
                anyEntityChanged = true;
            }
        }
    } else {
        for (const uuid of Object.keys(changes)) {
            // const entity = mergeEntity(oldBranch[uuid], changes[uuid] as any);
            const entity = deepApplyWithReuse(oldBranch[uuid], changes[uuid]);
            if (entity !== oldBranch[uuid]) {
                newBranch[uuid] = entity;
                anyEntityChanged = true;
            }
        }
    }

    return anyEntityChanged ? newBranch : oldBranch;
}
