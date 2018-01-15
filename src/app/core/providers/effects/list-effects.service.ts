import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class ListEffectsService {

    constructor(private api: ApiService,
                private config: ConfigService,
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

    loadMicroschemasForProject(project: string) {
        this.state.actions.list.fetchMicroschemasStart();
        this.api.project.getProjectMicroschemas({ project })
            .subscribe(
                ({data}) => this.state.actions.list.fetchMicroschemasSuccess(data),
                error => this.state.actions.list.fetchMicroschemasError() /* TODO: error handling */);
    }

    setActiveContainer(projectName: string, containerUuid: string, language: string) {
        // Update active container in state
        this.state.actions.list.setActiveContainer(projectName, containerUuid, language);

        // Refresh the node
        this.state.actions.list.fetchNodeStart(containerUuid);
        this.api.project.getNode({ project: projectName, nodeUuid: containerUuid, lang: this.languageWithFallbacks(language) })
            .subscribe(response => {
                this.state.actions.list.fetchNodeSuccess(response);
            }, error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            });

       this.loadChildren(projectName, containerUuid, language);
    }

    loadChildren(projectName: string, containerUuid: string, language: string) {
         // Refresh child node list
        this.state.actions.list.fetchChildrenStart();
        this.api.project
            .getNodeChildren({ project: projectName, nodeUuid: containerUuid, lang: this.languageWithFallbacks(language) })
            .subscribe(response => {
                this.state.actions.list.fetchChildrenSuccess(containerUuid, response.data);
            }, error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            });
    }

    private languageWithFallbacks(language: string): string {
        return this.config.CONTENT_LANGUAGES
            .sort((a, b) => a === language ? -1 : 1)
            .join(',');
    }
}
