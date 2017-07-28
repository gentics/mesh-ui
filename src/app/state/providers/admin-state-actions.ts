import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AuthState } from '../models/auth-state.model';
import { AdminState, AdminStateEntity } from '../models/admin-state.model';
import { ChangePasswordModalComponent } from '../../core/components/change-password-modal/change-password-modal.component';
import { EntityState } from '../models/entity-state.model';
import { ProjectResponse, SchemaResponse, MicroschemaResponse } from '../../common/models/server-models';
import { uuidHash } from '../../common/util/util';
import { mergeEntityState } from './entity-state-actions';
import { MicroschemaReference } from '../../common/models/common.model';

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
                    loadCount: 0
                }
            }
        });
    }

    actionStart() {
        this.admin.loadCount++;
    }

    actionSuccess() {
        this.admin.loadCount--;
    }

    actionError() {
        this.admin.loadCount--;
    }

    loadSchemasSuccess(schemas: SchemaResponse[]) {
        this.admin.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            schema: schemas
        });
    }

    createProjectSuccess(project: ProjectResponse) {
        this.admin.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            project: {
                [project.uuid]: project
            }
        });
    }

    deleteProjectSuccess(projectUuid: string) {
        // TODO implement
        throw new Error('Not implemented');
    }

    deleteMicroschemaSuccess(projectUuid: string) {
        // TODO implement
        throw new Error('Not implemented');
    }

    updateMicroschemaSuccess(response: MicroschemaResponse) {
        this.admin.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            microschema: {
                [response.uuid]: response
            }
        });
    }

    createMicroschemaSuccess(response: MicroschemaResponse) {
        this.admin.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            microschema: {
                [response.uuid]: response
            }
        });
    }

    openMicroschemaStart() {
        this.admin.loadCount++;
    }

    openMicroschemaSuccess(microschema: MicroschemaResponse) {
        this.admin.loadCount--;
        this.admin.openEntity = {
            type: 'microschema',
            uuid: microschema.uuid
        };
        this.entities = mergeEntityState(this.entities, {
            microschema: {
                [microschema.uuid]: microschema
            }
        });
    }

    openMicroschemaError() {
        this.admin.loadCount--;
    }

    newMicroschema() {
        delete this.admin.openEntity;
    }
}
