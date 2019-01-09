import { Injectable } from '@angular/core';

import { BinaryField, FieldMap, ImageTransform, MeshNode } from '../../common/models/node.model';
import {
    NodeCreateRequest,
    NodeResponse,
    NodeUpdateRequest,
    TagReferenceFromServer
} from '../../common/models/server-models';
import {
    getMeshNodeBinaryFields,
    getMeshNodeNonBinaryFields,
    promiseConcat,
    simpleCloneDeep
} from '../../common/util/util';
import { ApiService } from '../../core/providers/api/api.service';
import { ConfigService } from '../../core/providers/config/config.service';
import { I18nNotification } from '../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';
import { EntitiesService } from '../../state/providers/entities.service';

@Injectable()
export class EditorEffectsService {
    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private notification: I18nNotification,
        private config: ConfigService,
        private api: ApiService
    ) {}

    openNode(projectName: string, nodeUuid: string, language?: string): void {
        const lang = language || this.config.FALLBACK_LANGUAGE;
        this.state.actions.editor.openNode(projectName, nodeUuid, lang);

        this.loadNode(projectName, nodeUuid, language);
    }

    async loadNode(projectName: string, nodeUuid: string, language?: string) {
        // TODO: Language should be empty for default fallback behaviour.
        // Currently the default behaviour in mesh is not desireable.
        // See https://github.com/gentics/mesh/issues/502
        const lang = language || this.config.CONTENT_LANGUAGES.join(',');

        this.state.actions.list.fetchNodeStart();
        return new Promise((resolve, reject) => {
            this.api.project.getNode({ project: projectName, nodeUuid, lang }).subscribe(
                response => {
                    this.state.actions.list.fetchNodeSuccess(response);
                    resolve();
                },
                error => {
                    this.state.actions.list.fetchChildrenError();
                    reject();
                    throw new Error('TODO: Error handling');
                }
            );
        });
    }

    /**
     * Create an placeholder object in the state for the new node
     * and open dispatch an action to open it in the editor
     */
    createNode(projectName: string, schemaUuid: string, parentNodeUuid: string, language: string): void {
        this.api.project.getNode({ project: projectName, nodeUuid: parentNodeUuid }).subscribe(
            response => {
                this.state.actions.list.fetchNodeSuccess(response);
                this.state.actions.editor.openNewNode(projectName, schemaUuid, parentNodeUuid, language);
            },
            error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            }
        );
    }

    /**
     * Save a new node to the api endpoint
     */
    saveNewNode(projectName: string, node: MeshNode, tags?: TagReferenceFromServer[]): Promise<MeshNode | void> {
        this.state.actions.editor.saveNodeStart();
        const language = node.language || this.config.FALLBACK_LANGUAGE;

        const nodeCreateRequest: NodeCreateRequest = {
            fields: getMeshNodeNonBinaryFields(node),
            parentNode: node.parentNode,
            schema: node.schema,
            language: language
        };

        // TODO: remote lang lang: language from params.
        // It is currently needed to overcome the https://github.com/gentics/mesh/issues/404 issue
        // what it does now, it adds ?lang=language query param
        return this.api.project
            .createNode({ project: projectName, lang: language } as any, nodeCreateRequest)
            .toPromise()
            .then(this.notification.promiseSuccess('editor.node_saved'))
            .then(updatedNode => this.processTagsAndBinaries(node, updatedNode, tags))
            .then(
                savedNode => {
                    this.state.actions.editor.saveNodeSuccess(savedNode as MeshNode);
                    return savedNode;
                },
                (error: { node: MeshNode; error: any }) => {
                    this.state.actions.editor.saveNodeError();
                    // For the new nodes, if something went wrong while saving - delete the node immediately.
                    // That way the editor will decide what to do next (stay in an unchanged state?),
                    this.api.project
                        .deleteNode({ project: projectName, nodeUuid: error.node.uuid })
                        .take(1)
                        .subscribe();
                    throw error.error;
                }
            );
    }

    /**
     * Update an existing node
     */
    saveNode(node: MeshNode, tags?: TagReferenceFromServer[]): Promise<MeshNode | void> {
        if (!node.project.name) {
            throw new Error('Project name is not available');
        }

        this.state.actions.editor.saveNodeStart();

        const language = node.language || this.config.FALLBACK_LANGUAGE;
        const updateRequest: NodeUpdateRequest = {
            fields: getMeshNodeNonBinaryFields(node),
            version: node.version,
            language: language
        };

        return this.api.project
            .updateNode({ project: node.project.name, nodeUuid: node.uuid, language }, updateRequest)
            .toPromise()
            .then(response => {
                if (response.node) {
                    return this.processTagsAndBinaries(node, response.node, tags);
                } else {
                    throw new Error('No node was returned from the updateNode API call.');
                }
            })
            .then(this.notification.promiseSuccess('editor.node_saved'))
            .then(
                savedNode => {
                    this.state.actions.editor.saveNodeSuccess(savedNode as MeshNode);
                    return savedNode;
                },
                error => {
                    this.state.actions.editor.saveNodeError();
                    throw error;
                }
            );
    }

    publishNode(node: MeshNode): void {
        if (!node.project.name) {
            throw new Error('Project name is not available');
        }
        this.state.actions.editor.publishNodeStart();
        this.api.project
            .publishNode({ project: node.project.name, nodeUuid: node.uuid })
            .pipe(this.notification.rxSuccess('editor.node_published'))
            .subscribe(
                response => {
                    if (!node.language) {
                        throw new Error('Could not find language of node!');
                    }
                    const newNode = {
                        ...node,
                        availableLanguages: response.availableLanguages,
                        version: response.availableLanguages[node.language].version
                    };
                    this.state.actions.editor.publishNodeSuccess(newNode);
                },
                error => {
                    this.state.actions.editor.publishNodeError();
                }
            );
    }

    publishNodeLanguage(node: MeshNode): void {
        if (!node.project.name) {
            throw new Error('Project name is not available');
        }
        if (!node.language) {
            throw new Error('Language is node available');
        }
        this.state.actions.editor.publishNodeStart();
        this.api.project
            .publishNodeLanguage({ project: node.project.name, nodeUuid: node.uuid, language: node.language })
            .pipe(
                this.notification.rxSuccessNext('editor.node_language_published', version => ({
                    version: version.version
                }))
            )
            .subscribe(
                response => {
                    if (!node.language) {
                        throw new Error('Could not find language of node!');
                    }
                    const newNode = {
                        ...node,
                        availableLanguages: {
                            ...node.availableLanguages,
                            [node.language]: response
                        },
                        version: response.version
                    };
                    this.state.actions.editor.publishNodeSuccess(newNode);
                },
                error => {
                    this.state.actions.editor.publishNodeError();
                }
            );
    }

    unpublishNode(node: MeshNode): void {
        this.state.actions.editor.unpublishNodeStart();
        if (!node.project.name) {
            throw new Error('Project name is not available');
        }

        this.api.project
            .unpublishNode({ project: node.project.name, nodeUuid: node.uuid })
            .switchMap(() =>
                this.api.project.getNodePublishStatus({
                    project: node.project.name!,
                    nodeUuid: node.uuid
                })
            )
            .pipe(this.notification.rxSuccess('editor.node_unpublished'))
            .subscribe(
                response => {
                    if (!node.language) {
                        throw new Error('Could not find language of node!');
                    }
                    const newNode = {
                        ...node,
                        ...response
                    };
                    this.state.actions.editor.unpublishNodeSuccess(newNode);
                },
                error => {
                    this.state.actions.editor.unpublishNodeError();
                }
            );
    }

    unpublishNodeLanguage(node: MeshNode): void {
        this.state.actions.editor.unpublishNodeStart();
        if (!node.project.name) {
            throw new Error('Project name is not available');
        }
        if (!node.language) {
            throw new Error('Language is node available');
        }
        if (!node.availableLanguages[node.language].published) {
            this.notification.show({
                message: 'editor.node_already_unpublished'
            });
            return;
        }
        this.api.project
            .unpublishNodeLanguage({ project: node.project.name, nodeUuid: node.uuid, language: node.language })
            .switchMap(() =>
                this.api.project.getNodePublishStatus({
                    project: node.project.name!,
                    nodeUuid: node.uuid
                })
            )
            .pipe(this.notification.rxSuccess('editor.node_unpublished'))
            .subscribe(
                response => {
                    if (!node.language) {
                        throw new Error('Could not find language of node!');
                    }
                    const newNode = {
                        ...node,
                        ...response
                    };
                    this.state.actions.editor.unpublishNodeSuccess(newNode);
                },
                error => {
                    this.state.actions.editor.unpublishNodeError();
                }
            );
    }

    closeEditor(): void {
        this.state.actions.editor.closeEditor();
    }

    /**
     * Creates a translation of a node by cloning the given node and renaming certain fields which need to be unique.
     * This method is limited in that it does not work with binary fields and the renaming is naive and may fail.
     * TODO: update this when a translation endpoint in implemented in Mesh: https://github.com/gentics/mesh/issues/12
     */
    createTranslation(node: MeshNode, languageCode: string): Promise<MeshNode | void> {
        const clone = this.cloneNodeWithRename(node, languageCode.toUpperCase());
        if (clone) {
            clone.language = languageCode;
            return this.saveNode(clone, node.tags);
        } else {
            return Promise.reject(`Could not create translation`);
        }
    }

    /**
     * After creating or updating a node, a common set of operations needs to be performed, namely:
     * * Updating the node's tags
     * * Uploading any new binary files that have been selected for the node
     * * Applying any binary transforms
     */
    private processTagsAndBinaries(
        originalNode: MeshNode,
        updatedNode: MeshNode,
        tags?: TagReferenceFromServer[]
    ): Promise<MeshNode> {
        return this.assignTagsToNode(updatedNode, tags)
            .then(newNode => this.uploadBinaries(newNode, getMeshNodeBinaryFields(originalNode)))
            .then(newNode => newNode && this.applyBinaryTransforms(newNode, originalNode.fields));
    }

    private assignTagsToNode(node: NodeResponse, tags?: TagReferenceFromServer[]): Promise<NodeResponse> {
        if (!tags) {
            return Promise.resolve(node);
        }

        return this.api.project
            .assignTagsToNode({ project: node.project.name!, nodeUuid: node.uuid }, { tags })
            .toPromise()
            .then(() => node);
    }

    /**
     * Clones a node and changes the fields which should be unique in a given parentNode (i.e. displayField,
     * segmentField) by adding a suffix.
     */
    private cloneNodeWithRename(node: MeshNode, suffix: string): MeshNode | undefined {
        const clone = simpleCloneDeep(node);
        const schema = this.entities.getSchema(node.schema.uuid!);
        if (schema) {
            const displayField = schema.displayField;
            const segmentField = schema.segmentField;

            if (typeof node.fields[displayField] === 'string') {
                clone.fields[displayField] += ` (${suffix})`;
            }
            if (segmentField && segmentField !== displayField && node.fields[segmentField]) {
                if (node.fields[segmentField].sha512sum) {
                    clone.fields[segmentField].fileName = this.addSuffixToString(
                        node.fields[segmentField].fileName,
                        suffix
                    );
                } else if (node.fields[segmentField] !== undefined) {
                    clone.fields[segmentField] = this.addSuffixToString(clone.fields[segmentField], suffix);
                }
            }

            // Display a warning if there are any binary fields - these cannot be handled properly
            // until the dedicated translation endpoint is implemented in Mesh.
            const firstBinaryField = this.getFirstBinaryField(node);
            if (firstBinaryField && firstBinaryField.key !== undefined) {
                console.warn(`Note: binary fields cannot yet be copied.`);
            }

            return clone;
        }
    }

    /**
     * Given a string value, append the suffix to the end.
     * If the value has periods in it (as in a file name), then insert
     * the suffix before the file extension:
     *
     * foo => foo_de
     * foo.html => foo.de.html
     */
    private addSuffixToString(value: string, suffix: string, delimiter: string = '_'): string {
        const parts = value.split('.');
        if (1 < parts.length) {
            parts.splice(-1, 0, suffix);
            return parts.join('.');
        } else {
            return value + delimiter + suffix;
        }
    }

    /**
     * Given a node, check for any binary fields if one if found, return the first
     * in an object with key (field name) and value (binary field properties).
     */
    private getFirstBinaryField(node: MeshNode): { key: string; value: BinaryField } | undefined {
        let binaryFieldKey;
        let binaryFieldValue;

        if (node) {
            for (const key in node.fields) {
                if (node.fields.hasOwnProperty(key)) {
                    const field = node.fields[key];
                    if (field && field.fileSize) {
                        if (binaryFieldValue === undefined) {
                            binaryFieldKey = key;
                            binaryFieldValue = field;
                        }
                    }
                }
            }

            if (binaryFieldKey && binaryFieldValue) {
                return {
                    key: binaryFieldKey,
                    value: binaryFieldValue
                };
            }
        }
    }

    private uploadBinaries(node: MeshNode, fields: FieldMap): Promise<MeshNode> {
        const projectName = node.project.name;
        const language = node.language;

        // if no binaries are present - return the same node
        if (Object.keys(fields).length === 0 || !projectName || !language) {
            return Promise.resolve(node);
        }

        const promiseSuppliers = Object.keys(fields).map(key => () =>
            this.uploadBinary(projectName, node.uuid, key, fields[key].file, language, node.version)
        );

        return (
            promiseConcat(promiseSuppliers)
                // return the node from the last successful request
                .then(nodes => nodes[nodes.length - 1])
                .catch(error => {
                    throw { node, error };
                })
        );
    }

    private uploadBinary(
        project: string,
        nodeUuid: string,
        fieldName: string,
        binary: File,
        language: string,
        version: string
    ): Promise<MeshNode> {
        // TODO: remote lang lang: language from params.
        // It is currently needed to overcome the https://github.com/gentics/mesh/issues/404 issue
        // what it does now, it adds ?lang=language query param
        return this.api.project
            .updateBinaryField(
                {
                    project,
                    nodeUuid,
                    fieldName,
                    lang: language
                } as any,
                {
                    binary,
                    language,
                    version
                }
            )
            .toPromise();
    }

    private applyBinaryTransforms(node: MeshNode, fields: FieldMap): Promise<MeshNode> {
        const project = node.project.name;
        const nodeUuid = node.uuid;
        const language = node.language;

        if (!project || !nodeUuid || !language) {
            return Promise.reject('Project name, node language or node uuid not available.');
        }
        const promises = Object.keys(fields)
            .filter(fieldName => fields[fieldName] && !!fields[fieldName].transform)
            .map(fieldName => {
                const value = fields[fieldName] as BinaryField;
                const transform = value.transform as ImageTransform;
                return this.api.project
                    .transformBinaryField(
                        {
                            project,
                            nodeUuid,
                            fieldName
                        },
                        {
                            version: node.version,
                            language: language,
                            width: transform.width,
                            height: transform.height,
                            cropRect: transform.cropRect
                        }
                    )
                    .toPromise();
            });

        if (!promises.length) {
            return Promise.resolve(node);
        }

        return (
            Promise.all(promises)
                // return the node from the last successful request
                .then(nodes => nodes[nodes.length - 1])
                .catch(error => {
                    throw { node, error };
                })
        );
    }
}
