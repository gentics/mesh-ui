import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { AdminState } from '../models/admin-state.model';
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
        this.entities = mergeEntityState(this.entities, {
            project: {
                [projectUuid]: undefined
            }
        });
    }

    updateMicroschemaSuccess(response: MicroschemaResponse) {
        this.entities = mergeEntityState(this.entities, {
            microschema: {
                [response.uuid]: response
            }
        });
    }
}
