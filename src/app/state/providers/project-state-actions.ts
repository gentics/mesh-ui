import { StateActionBranch, Immutable, CloneDepth } from 'immutablets';
import { Injectable } from '@angular/core';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';

@Injectable()
@Immutable()
export class ProjectStateActions extends StateActionBranch<EntityState> {
    constructor() {
        super({
            uses: ['projects'],
            initialState: {
                projects: {}
            }
        });
    }
}
