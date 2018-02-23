import { Injectable } from '@angular/core';

import { ApiService } from '../api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ConfigService } from '../config/config.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { MeshNode } from '../../../common/models/node.model';
import { NodeResponse } from '../../../common/models/server-models';
import { Tag } from '../../../common/models/tag.model';
import { I18nNotification } from '../i18n-notification/i18n-notification.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class ListEffectsService {

    constructor(private api: ApiService,
                private config: ConfigService,
                private state: ApplicationStateService,
                private notification: I18nNotification,
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
     */
    loadChildren(projectName: string, containerUuid: string, language: string):void {
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

    searhNodesByTags(tags: string, project: string): void {
        this.state.actions.list.actionStart();
        const query = JSON.stringify({
            query: {
                query_string: {
                    query: tags
                }
            }
        });

        const queryString = `{
            tags (query: ${JSON.stringify(query)}) {
                elements {
                    name,
                    uuid,
                    tagFamily {
                        name
                    },
                    nodes {
                        elements {
                        uuid
                        }
                    }
                }
            }
        }`;

    this.api.graphQL({project}, {query: queryString})
        .subscribe(results => {
            console.log('results', results);
            this.state.actions.list.actionSuccess();
        });
    }

    resetSearch(): void  {
        this.state.actions.list.setSearchResults(null);
    }

    /**
     * Load the children for the opened folder
     */
    searchNodesByKeyword(term: string, project: string, language: string): void {
        this.state.actions.list.actionStart();
        const query = JSON.stringify({
            query: {
                query_string: {
                    query: term
                }
            }
        });

        const queryString = `{
            nodes (query: ${JSON.stringify(query)}) {
                elements {
                  displayName,
                  uuid,
                }
            }
        }`;

        this.api.graphQL({project}, {query: queryString})
            .subscribe(results => {
                if (results.data) {
                    if (results.data.nodes.elements.length === 0) {
                        this.state.actions.list.setSearchResults([]);
                    } else {
                        forkJoin<NodeResponse>(results.data.nodes.elements.map(node =>
                            this.api.project.getNode({project, nodeUuid: node.uuid})
                        ))
                        .first()
                        .subscribe(nodes => {
                            this.state.actions.list.setSearchResults(nodes);
                        });
                    }
                } else {
                    this.notification.show({
                        type: 'error',
                        message: 'list.search_error_occured'
                    });
                }
            });
   }

    /**
     * make a comma seperated list of langues. Put the passed language in front
     */
    private languageWithFallbacks(language: string): string {
        return this.config.CONTENT_LANGUAGES
            .sort((a, b) => a === language ? -1 : 1)
            .join(',');
    }

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
