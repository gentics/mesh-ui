import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { MicroschemaResponse, NodeResponse, ProjectResponse, SchemaResponse } from '../../common/models/server-models';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { ListState } from '../models/list-state.model';
import { mergeEntityState } from './entity-state-actions';

@Injectable()
@Immutable()
export class ListStateActions extends StateActionBranch<AppState> {
    @CloneDepth(0) private entities: EntityState;
    @CloneDepth(1) private list: ListState;

    constructor() {
        super({
            uses: ['entities', 'list'],
            initialState: {
                list: {
                    currentNode: undefined,
                    currentProject: undefined,
                    loadCount: 0
                }
            }
        });
    }

    fetchChildrenStart() {
        this.list.loadCount++;
    }

    fetchChildrenSuccess(containerUuid: string, children: NodeResponse[]) {
        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            node: [
                ...children,
                {
                    uuid: containerUuid,
                    children: children.map(node => node.uuid)
                }
            ]
        });
    }

    fetchChildrenError() {
        this.list.loadCount--;
    }

    fetchNodeStart(nodeUuid: string) {
        this.list.loadCount++;
    }

    fetchNodeSuccess(node: NodeResponse) {
        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            node: [node]
        });
    }

    fetchNodeError(nodeUuid: string) {
        this.list.loadCount--;
    }

    fetchProjectsStart() {
        this.list.loadCount++;
    }

    fetchProjectsSuccess(projects: ProjectResponse[]) {
        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            project: projects
        });
    }

    fetchProjectsError() {
        this.list.loadCount--;
    }

    fetchMicroschemasStart() {
        this.list.loadCount++;
    }

    fetchMicroschemasSuccess(microschemas: MicroschemaResponse[]) {
        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            microschema: microschemas
        });
    }

    fetchMicroschemasError() {
        this.list.loadCount--;
    }

    fetchMicroschemaStart() {
        this.list.loadCount++;
    }

    fetchMicroschemaSuccess(microschema: MicroschemaResponse) {
        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            microschema: {
                [microschema.uuid]: microschema
            }
        });
    }

    fetchMicroschemaError() {
        this.list.loadCount--;
    }

    fetchSchemasStart(projectName: string) {
        this.list.loadCount++;
    }

    fetchSchemasSuccess(projectName: string, schemas: SchemaResponse[]) {
        const projectUuid = Object.keys(this.entities.project)
            .filter(uuid => this.entities.project[uuid].name === projectName)[0];

        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            project: {
                [projectUuid]: {
                    schemas: schemas.map(schema => schema.uuid)
                }
            },
            schema: schemas
        });
    }

    fetchSchemasError() {
        this.list.loadCount--;
    }

    /** Change the active container in the list view from values of the current route. */
    setActiveContainer(projectName: string, containerUuid: string) {
        this.list.currentProject = projectName;
        this.list.currentNode = containerUuid;
    }

}
