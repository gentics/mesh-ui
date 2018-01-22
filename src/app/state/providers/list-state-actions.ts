import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { MicroschemaResponse, NodeResponse, ProjectResponse, SchemaResponse } from '../../common/models/server-models';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { ListState } from '../models/list-state.model';
import { mergeEntityState } from './entity-state-actions';
import { AdminState } from '../models/admin-state.model';
import { Microschema } from '../../common/models/microschema.model';
import { Schema } from '../../common/models/schema.model';
import { ConfigService } from '../../core/providers/config/config.service';

@Injectable()
@Immutable()
export class ListStateActions extends StateActionBranch<AppState> {
    @CloneDepth(0) private entities: EntityState;
    @CloneDepth(1) private list: ListState;
    @CloneDepth(1) private admin: AdminState;

    constructor(private config: ConfigService) {
        super({
            uses: ['entities', 'list', 'admin'],
            initialState: {
                list: {
                    currentNode: undefined,
                    currentProject: undefined,
                    loadCount: 0,
                    language: config.FALLBACK_LANGUAGE,
                    children: []
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
                }
            ]
        }, false);
        this.list.children = children.map(node => node.uuid);
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
        this.admin.displayedProjects = projects.map(project => project.uuid);
    }

    fetchProjectsError() {
        this.list.loadCount--;
    }

    fetchMicroschemasStart() {
        this.list.loadCount++;
    }

    fetchMicroschemasSuccess(microschemas: MicroschemaResponse[]) {
        this.list.loadCount--;
        this.admin.displayedMicroschemas = microschemas.map(schema => schema.uuid);
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

    fetchSchemaStart() {
        this.list.loadCount++;
    }

    fetchSchemaSuccess(schema: SchemaResponse) {
        this.list.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            schema: [schema as Schema]
        });
    }

    fetchSchemaError() {
        this.list.loadCount--;
    }

    deleteNodeStart() {
        this.list.loadCount++;
    }

    deleteNodeError() {
        this.list.loadCount--;
    }

    deleteNodeSuccess() {
        this.list.loadCount--;
    }

    /** Change the active container in the list view from values of the current route. */
    setActiveContainer(projectName: string, containerUuid: string, language: string) {
        this.list.currentProject = projectName;
        this.list.currentNode = containerUuid;
        this.list.language = language;
    }

}
