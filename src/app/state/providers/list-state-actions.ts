import { Injectable } from '@angular/core';
import { StateActionBranch, Immutable, CloneDepth } from 'immutablets';

import { NodeResponse, ProjectResponse } from '../../common/models/server-models';
import { MeshNode } from '../../common/models/node.model';
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

    /** Change the active container in the list view from values of the current route. */
    setActiveContainer(projectName: string, containerUuid: string) {
        this.list.currentProject = projectName;
        this.list.currentNode = containerUuid;
    }

}
