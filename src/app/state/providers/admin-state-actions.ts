import { Injectable } from '@angular/core';
import { Immutable, StateActionBranch, CloneDepth } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';
import { AdminState } from '../models/admin-state.model';
import { ChangePasswordModalComponent } from '../../core/components/change-password-modal/change-password-modal.component';
import { EntityState } from '../models/entity-state.model';
import { ProjectResponse, SchemaResponse } from '../../common/models/server-models';
import { uuidHash } from '../../common/util/util';
import { mergeEntityState } from './entity-state-actions';

@Injectable()
@Immutable()
export class AdminStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private admin: AdminState;
    @CloneDepth(0) private entities: EntityState;

    constructor() {
        super({
            uses: ['admin', 'entities'],
            initialState: {
                admin: {
                    schemasLoading: false
                }
            }
        });
    }

    loadSchemasStart() {
        this.admin.schemasLoading = true;
    }

    loadSchemasSuccess(schemas: SchemaResponse[]) {
        this.admin.schemasLoading = false;
        this.entities = mergeEntityState(this.entities, {
            schema: schemas
        });
    }

    loadSchemasError() {
        this.admin.schemasLoading = false;
    }
}
