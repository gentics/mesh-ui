import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { MicroschemaResponse, NodeResponse, ProjectResponse, SchemaResponse } from '../../common/models/server-models';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { ListState } from '../models/list-state.model';
import { mergeEntityState } from './entity-state-actions';
import { Microschema } from '../../common/models/microschema.model';
import { Schema } from '../../common/models/schema.model';

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

    // TODO: think about how we will handle language variants of containers.
    // For now we will rely on the "best guess" default behaviour of
    // the getNestedEntity() function within mergeEntityState()
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
        }, false);
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
            microschema: microschemas as Microschema[]
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
            microschema: [microschema as Microschema]
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
            project: [{
                uuid: projectUuid,
                schemas: schemas.map(schema => ({
                    name: schema.name,
                    uuid: schema.uuid,
                    version: schema.version
                }))
            }],
            schema: schemas as Schema[]
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
