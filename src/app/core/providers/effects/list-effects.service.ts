import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ConfigService } from '../config/config.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { MeshNode } from '../../../common/models/node.model';

@Injectable()
export class ListEffectsService {

    constructor(private api: ApiService,
                private config: ConfigService,
                private state: ApplicationStateService,
                private entities: EntitiesService) {
    }

    /**
     * Load all projects
     */
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

    /**
     * @param project project name
     */
    loadSchemasForProject(project: string) {
        this.state.actions.list.fetchSchemasStart(project);
        this.api.project.getProjectSchemas({ project })
            .subscribe(
                ({data}) => this.state.actions.list.fetchSchemasSuccess(project, data),
                error => this.state.actions.list.fetchSchemasError() /* TODO: error handling */);
    }

    /**
     * @param project project name
     */
    loadMicroschemasForProject(project: string) {
        this.state.actions.list.fetchMicroschemasStart();
        this.api.project.getProjectMicroschemas({ project })
            .subscribe(
                ({data}) => this.state.actions.list.fetchMicroschemasSuccess(data),
                error => this.state.actions.list.fetchMicroschemasError() /* TODO: error handling */);
    }
    /**
     * Basicaly display the content of the folder in the list view
     * @param projectName
     * @param containerUuid
     * @param language
     */
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

    /**
     * Load the children for the opened folder
     * @param projectName
     * @param containerUuid
     * @param language
     */
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

    /**
     * make a comma seperated list of langues. Put the passed language in front
     * @param language
     */
    private languageWithFallbacks(language: string): string {
        return this.config.CONTENT_LANGUAGES
            .sort((a, b) => a === language ? -1 : 1)
            .join(',');
    }

    /**
     *
     */
    public deleteNode(node: MeshNode, recursive: boolean): void {
        this.state.actions.list.deleteNodeStart();
        this.api.project.deleteNode({ project: node.project.name, nodeUuid: node.uuid, recursive })
            .subscribe(result => {
                this.state.actions.list.deleteNodeSuccess();
                const parentNode = this.entities.getNode(node.parentNode.uuid, { language: node.language });
                this.loadChildren(parentNode.project.name, parentNode.uuid, parentNode.language);
        }, error => {
            this.state.actions.list.deleteNodeError();
            throw new Error('TODO: Error handling');
        })
    }
}
