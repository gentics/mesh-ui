import { Injectable } from '@angular/core';
import { Immutable, StateActionBranch } from 'immutablets';
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
                    schema: {}
                }
            }
        });
    }
}
