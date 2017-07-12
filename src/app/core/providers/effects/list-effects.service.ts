import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Injectable()
export class ListEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
    }

    loadProjects() {
        this.state.actions.list.fetchProjectsStart();
        // TODO How to handle paging? Should all projects be loaded?
        this.api.project.getProjects({})
            .subscribe(projects => {
                this.state.actions.list.fetchProjectsSuccess(projects.data);
            }, error => {
                this.state.actions.list.fetchProjectsError();
            });
    }

    loadSchemasForProject(project: string) {
        this.state.actions.list.fetchSchemasStart(project);
        this.api.project.getProjectSchemas({ project })
            .subscribe(
                ({data}) => this.state.actions.list.fetchSchemasSuccess(project, data),
                error => this.state.actions.list.fetchSchemasError() /* TODO: error handling */);
    }

    setActiveContainer(projectName: string, containerUuid: string) {
        // Update active container in state
        this.state.actions.list.setActiveContainer(projectName, containerUuid);

        // Refresh the node
        this.state.actions.list.fetchNodeStart(containerUuid);
        this.api.project.getProjectNode({ project: projectName, nodeUuid: containerUuid })
            .subscribe(response => {
                this.state.actions.list.fetchNodeSuccess(response);
            }, error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            });

        // Refresh child node list
        this.state.actions.list.fetchChildrenStart();
        this.api.project
            .getNodeChildren({ project: projectName, nodeUuid: containerUuid })
            .subscribe(response => {
                this.state.actions.list.fetchChildrenSuccess(containerUuid, response.data);
            }, error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            });
    }
}
