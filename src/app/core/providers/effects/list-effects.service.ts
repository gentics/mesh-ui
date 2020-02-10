import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of as observableOf, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DEFAULT_ITEMS_PER_PAGE, QUERY_KEY_PAGE, QUERY_KEY_PERPAGE } from 'src/app/common/constants';

import { MeshNode } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { NodeCreateRequest, NodeListResponse } from '../../../common/models/server-models';
import { Tag } from '../../../common/models/tag.model';
import { simpleCloneDeep } from '../../../common/util/util';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ApiService } from '../api/api.service';
import { ConfigService } from '../config/config.service';
import { I18nNotification } from '../i18n-notification/i18n-notification.service';

@Injectable()
export class ListEffectsService {
    constructor(
        private api: ApiService,
        private config: ConfigService,
        private state: ApplicationStateService,
        private notification: I18nNotification,
        private entities: EntitiesService,
        private route: ActivatedRoute
    ) {}

    /**
     * Load all projects
     */
    loadProjects() {
        this.state.actions.list.fetchProjectsStart();
        // TODO How to handle paging? Should all projects be loaded?
        this.api.project.getProjects({}).subscribe(
            projects => {
                this.state.actions.list.fetchProjectsSuccess(projects.data);
            },
            error => {
                this.state.actions.list.fetchProjectsError();
            }
        );
    }

    /**
     * @param project project name
     */
    loadSchemasForProject(project: string) {
        this.state.actions.list.fetchSchemasStart(project);
        return this.api.project.getProjectSchemas({ project }).pipe(
            tap(
                ({ data }) => {
                    return this.state.actions.list.fetchSchemasSuccess(project, data);
                },
                error => {
                    return this.state.actions.list.fetchSchemasError(); /* TODO: error handling */
                }
            )
        );
    }

    /**
     * @param project project name
     */
    loadMicroschemasForProject(project: string) {
        this.state.actions.list.fetchMicroschemasStart();
        this.api.project
            .getProjectMicroschemas({ project })
            .subscribe(
                ({ data }) => this.state.actions.list.fetchMicroschemasSuccess(project, data),
                error => this.state.actions.list.fetchMicroschemasError() /* TODO: error handling */
            );
    }
    /**
     * Basically display the content of the folder in the list view
     */
    setActiveContainer(projectName: string, containerUuid: string, language: string) {
        // Update active container in state
        this.state.actions.list.setActiveContainer(projectName, containerUuid, language);

        // Refresh the node
        this.state.actions.list.fetchNodeStart();
        this.api.project
            .getNode({ project: projectName, nodeUuid: containerUuid, lang: this.languageWithFallbacks(language) })
            .subscribe(
                response => {
                    this.state.actions.list.fetchNodeSuccess(response);
                },
                error => {
                    this.state.actions.list.fetchNodeError();
                    throw new Error('TODO: Error handling');
                }
            );

        this.loadChildren(projectName, containerUuid, language);
    }

    /**
     * Load the children for the opened folder
     */
    loadChildren(
        projectName: string,
        containerUuid: string,
        language: string,
        page?: number,
        perPage?: number
    ): Promise<NodeListResponse> {
        // Refresh child node list
        this.state.actions.list.fetchChildrenStart();
        return this.api.project
            .getNodeChildren({
                project: projectName,
                nodeUuid: containerUuid,
                page: page || this.route.snapshot.queryParams[QUERY_KEY_PAGE],
                perPage: perPage || this.route.snapshot.queryParams[QUERY_KEY_PERPAGE] || DEFAULT_ITEMS_PER_PAGE,
                lang: this.languageWithFallbacks(language)
            })
            .pipe(
                tap(
                    response => {
                        this.state.actions.list.fetchChildrenSuccess(containerUuid, response.data);
                        return response.data;
                    },
                    error => {
                        this.state.actions.list.fetchChildrenError();
                        throw new Error('TODO: Error handling');
                    }
                )
            )
            .toPromise();
    }

    searchNodes(searchTerm: string, tags: Tag[], projectName: string, languageCode: string): void {
        this.state.actions.list.searchNodesStart();
        const hasTags = 0 < tags.length;
        const hasSearchTerm = 0 < searchTerm.trim().length;

        const searchRequests: Array<Observable<MeshNode[]>> = [
            hasTags ? this.searchNodesByTags(tags, projectName, languageCode) : observableOf([]),
            hasSearchTerm ? this.searchNodesByKeyword(searchTerm, projectName, languageCode) : observableOf([])
        ];

        forkJoin(searchRequests).subscribe(results => {
            const nodesFromTagSearch = results[0];
            const nodesFromKeywordSearch = results[1];
            const finalResult = this.reconcileSearchResults(
                nodesFromKeywordSearch,
                nodesFromTagSearch,
                hasSearchTerm,
                hasTags
            );
            this.state.actions.list.searchNodesSuccess(finalResult);
        });
    }

    /**
     * There are two types of search results: searched by keyword and searched by tag.
     * First we look at the searchedNodes and if it's !== null we apply intersect it with the searchedTags
     * If The searchedNodes === null and searchedTags !== null - we return full searchedTags.
     * Otherwise we just return nodes of current selected parent node.
     */
    private reconcileSearchResults(
        nodesFromKeywordSearch: MeshNode[],
        nodesFromTagSearch: MeshNode[],
        hasSearchTerm: boolean,
        hasTags: boolean
    ): MeshNode[] {
        let finalResult: MeshNode[] = [];

        if (hasSearchTerm) {
            if (hasTags) {
                // Intersect with searchedTags.
                finalResult = nodesFromKeywordSearch.filter(nodeFromKeywordSearch =>
                    nodesFromTagSearch.some(nodeFromTagSearch => nodeFromKeywordSearch.uuid === nodeFromTagSearch.uuid)
                );
            } else {
                finalResult = nodesFromKeywordSearch;
            }
        } else if (hasTags) {
            finalResult = nodesFromTagSearch;
        } else {
            // No searching is done at all.
            throw new Error('No search term or tags were specified');
        }

        return finalResult;
    }

    searchNodesByTags(tags: Tag[], project: string, language: string): Observable<MeshNode[]> {
        const tagNames: string = tags.map(tag => tag.name).join(' ');

        const query = {
            query: {
                bool: {
                    must: [
                        {
                            nested: {
                                path: 'tags',
                                query: {
                                    bool: {
                                        must: [
                                            {
                                                term: {
                                                    'tags.name.raw': tagNames
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            sort: [
                {
                    created: 'asc'
                }
            ]
        };

        return this.api.project.searchNodes({ project }, query).pipe(
            map(results => {
                return results.data as MeshNode[];
            })
        );
    }

    /**
     * Load the children for the opened folder
     */
    searchNodesByKeyword(term: string, project: string, language: string): Observable<MeshNode[]> {
        const query = {
            query: {
                query_string: {
                    query: term
                }
                // Would search just in the 'name' field.
                /*match_phrase: {
                    'displayField.value': term,
                }*/
            },
            sort: [{ created: 'asc' }]
        };

        return this.api.project.searchNodes({ project }, query).pipe(
            map(results => {
                return results.data as MeshNode[];
            })
        );
    }

    /**
     * make a comma seperated list of langues. Put the passed language in front
     */
    private languageWithFallbacks(language: string): string {
        return this.config.CONTENT_LANGUAGES.sort((a, b) => (a === language ? -1 : 1)).join(',');
    }

    /**
     * Copies a node.
     * @param source uuid of the node to be moved
     * @param destination uuid of the destination container node
     */
    public copyNode(source: MeshNode, destination: string) {
        const requestNode = simpleCloneDeep(source);
        // TODO better conflict handling
        // TODO Copy all languages?
        this.state.actions.list.copyNodeStart();
        const { segmentField, displayField, fields } = this.entities.getSchema(source.schema.uuid)!;
        // TODO support other field types
        if (displayField && isStringField(fields, displayField)) {
            source.fields[displayField] += ' (copy)';
        }
        if (segmentField && isStringField(fields, displayField)) {
            source.fields[segmentField] += '_copy';
        }

        const request: NodeCreateRequest = {
            parentNode: { uuid: destination },
            fields: source.fields,
            language: source.language!,
            schema: source.schema
        };

        this.api.project
            .createNode({ project: source.project.name! }, request)
            .pipe(this.notification.rxSuccess('list.copy_success'))
            .subscribe(
                result => {
                    this.state.actions.list.copyNodeSuccess();
                    if (result.parentNode.uuid === source.parentNode.uuid) {
                        this.reloadCurrentFolder(source);
                    }
                },
                error => {
                    this.state.actions.list.copyNodeError();
                }
            );
    }

    /**
     * Moves a node.
     * @param source uuid of the node to be moved
     * @param destination uuid of the destination container node
     */
    public moveNode(source: MeshNode, destination: string) {
        this.state.actions.list.moveNodeStart();
        this.api.project
            .moveNode(
                {
                    project: source.project.name!,
                    nodeUuid: source.uuid,
                    toUuid: destination
                },
                undefined
            )
            .pipe(this.notification.rxSuccess('list.move_success'))
            .subscribe(
                result => {
                    this.state.actions.list.moveNodeSuccess();
                    this.reloadCurrentFolder(source);
                },
                error => {
                    this.state.actions.list.moveNodeError();
                }
            );
    }

    public deleteNode(node: MeshNode, recursive: boolean): void {
        this.state.actions.list.deleteNodeStart();
        this.api.project.deleteNode({ project: node.project.name!, nodeUuid: node.uuid, recursive }).subscribe(
            result => {
                this.state.actions.list.deleteNodeSuccess();
                const editorState = this.state.now.editor;
                if (editorState.editorIsOpen && editorState.openNode && editorState.openNode.uuid === node.uuid) {
                    this.state.actions.editor.closeEditor();
                }
                this.reloadCurrentFolder(node);
            },
            error => {
                this.state.actions.list.deleteNodeError();
                throw new Error('TODO: Error handling');
            }
        );
    }

    private reloadCurrentFolder(childNode: MeshNode) {
        const parentNode = this.entities.getNode(childNode.parentNode.uuid, { language: childNode.language });
        if (parentNode && parentNode.language) {
            this.loadChildren(parentNode.project.name!, parentNode.uuid, parentNode.language);
        }
    }

    public setFilterTerm(term: string) {
        this.state.actions.list.setFilterTerm(term);
    }
}

function isStringField(fields: SchemaField[], name: string): boolean {
    for (const field of fields) {
        if (field.name === name) {
            return field.type === 'string';
        }
    }
    throw new Error(`Field with name {${name}} could not be found`);
}
