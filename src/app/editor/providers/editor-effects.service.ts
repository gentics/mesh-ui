import { Injectable } from '@angular/core';
import { ApplicationStateService } from '../../state/providers/application-state.service';
import { ApiService } from '../../core/providers/api/api.service';
import { BinaryField, MeshNode } from '../../common/models/node.model';
import {
    FieldMapFromServer,
    NodeCreateRequest,
    NodeResponse,
    NodeUpdateRequest,
    TagReferenceFromServer
} from '../../common/models/server-models';
import { I18nNotification } from '../../core/providers/i18n-notification/i18n-notification.service';
import { ConfigService } from '../../core/providers/config/config.service';
import { getMeshNodeBinaryFields, getMeshNodeNonBinaryFields, simpleCloneDeep } from '../../common/util/util';
import { EntitiesService } from '../../state/providers/entities.service';
import { tagsAreEqual } from '../form-generator/common/tags-are-equal';


@Injectable()
export class EditorEffectsService {

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private notification: I18nNotification,
                private config: ConfigService,
                private api: ApiService) {}

    openNode(projectName: string, nodeUuid: string, language?: string): void {
        const lang = language || this.config.FALLBACK_LANGUAGE;
        this.state.actions.editor.openNode(projectName, nodeUuid, lang);

        // Refresh the node
        this.state.actions.list.fetchNodeStart();
        this.api.project.getNode({ project: projectName, nodeUuid, lang })
            .subscribe(response => {
                this.state.actions.list.fetchNodeSuccess(response);
            }, error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            });
    }

    /**
     * Create an placeholder object in the state for the new node
     * and open dispatch an action to open it in the editor
     */
    createNode(projectName: string, schemaUuid: string, parentNodeUuid: string, language: string): void {
        this.api.project.getNode({project: projectName, nodeUuid: parentNodeUuid})
            .subscribe(response => {
                this.state.actions.list.fetchNodeSuccess(response);
                this.state.actions.editor.openNewNode(projectName, schemaUuid, parentNodeUuid, language);
            }, error => {
                this.state.actions.list.fetchChildrenError();
                throw new Error('TODO: Error handling');
            });
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
            language: language,
        };

        // TODO: remote lang lang: language from params.
        // It is currently needed to overcome the https://github.com/gentics/mesh/issues/404 issue
        // what it does now, it adds ?lang=language query param
        return this.api.project.createNode({ project: projectName, lang: language } as any, nodeCreateRequest)
            .toPromise()
            .then(updatedNode => this.processTagsAndBinaries(node, updatedNode, tags))
            .then(savedNode => {
                    this.state.actions.editor.saveNodeSuccess(savedNode as MeshNode);
                    this.notification.show({
                        type: 'success',
                        message: 'editor.node_saved'
                    });
                    return savedNode;
                }, (error: {node: MeshNode, error: any}) => {
                this.state.actions.editor.saveNodeError();
                this.notification.show({
                    type: 'error',
                    message: 'editor.node_save_error'
                });


                // For the new nodes, if something went wrong while saving - delete the node immediately.
                // That way the editor will decide what to do next (stay in an unchanged state?),
                this.api.project.deleteNode({ project: projectName, nodeUuid: error.node.uuid}).take(1).subscribe();
                throw error.error;
            });
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
            fields: node.fields,
            version: node.version,
            language: language
        };

        return this.api.project.updateNode({ project: node.project.name, nodeUuid: node.uuid, language }, updateRequest)
            .toPromise()
            .then(response => {
                if (response.conflict) {
                    // TODO: conflict resolution handling
                    throw new Error('saveNode was rejected');
                } else if (response.node) {
                    return this.processTagsAndBinaries(node, response.node, tags);
                } else {
                    this.state.actions.editor.saveNodeError();
                    this.notification.show({
                        type: 'error',
                        message: 'editor.node_save_error'
                    });
                    return response.node;
                }
            })
            .then(savedNode => {
                this.state.actions.editor.saveNodeSuccess(savedNode as MeshNode);
                this.notification.show({
                    type: 'success',
                    message: 'editor.node_saved'
                });
                return savedNode;
            }, error => {
                this.state.actions.editor.saveNodeError();
                this.notification.show({
                    type: 'error',
                    message: 'editor.node_save_error'
                });
                throw error;
            });
    }

    publishNode(node: MeshNode): void {
        if (!node.project.name) {
            throw new Error('Project name is not available');
        }
        this.state.actions.editor.publishNodeStart();
        this.api.project.publishNode({ project: node.project.name, nodeUuid: node.uuid })
            .map(response => {
                let newVersion: string | undefined;
                if (response.availableLanguages && node.language) {
                    newVersion = response.availableLanguages[node.language].version;
                }
                if (newVersion) {
                    return newVersion;
                } else {
                    throw new Error('New version could not be retrieved');
                }
            })
            .subscribe(version => {
                    this.notification.show({
                        type: 'success',
                        message: 'editor.node_published',
                        translationParams: { version }
                    });
                    const newNode = Object.assign({}, node, { version });
                    this.state.actions.editor.publishNodeSuccess(newNode);
                },
                error => {
                    this.state.actions.editor.publishNodeError();
                    this.notification.show({
                        type: 'error',
                        message: 'editor.node_publish_error'
                    });
                    throw new Error('TODO: Error handling');
                });
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
    private processTagsAndBinaries(originalNode: MeshNode, updatedNode: MeshNode, tags?: TagReferenceFromServer[]): Promise<MeshNode> {
        return this.assignTagsToNode(updatedNode, tags)
            .then(newNode => this.uploadBinaries(newNode, getMeshNodeBinaryFields(originalNode)))
            .then(newNode => newNode && this.applyBinaryTransforms(newNode, originalNode.fields));
    }

    private assignTagsToNode(node: NodeResponse, tags?: TagReferenceFromServer[]): Promise<NodeResponse> {
        if (tags === null) {
            return Promise.resolve(node);
        }

        return this.api.project.assignTagsToNode({project: node.project.name, nodeUuid: node.uuid}, { tags })
            .toPromise()
            .then(() => node);
    }


    /**
     * Clones a node and changes the fields which should be unique in a given parentNode (i.e. displayField,
     * segmentField) by adding a suffix.
     */
    private cloneNodeWithRename(node: MeshNode, suffix: string): MeshNode | undefined {
        const clone = simpleCloneDeep(node);
        const schema = this.entities.getSchema(node.schema.uuid);
        if (schema) {
            const displayField = schema.displayField;
            const segmentField = schema.segmentField;

            if (typeof node.fields[displayField] === 'string') {
                clone.fields[displayField] += ` (${suffix})`;
            }
            if (segmentField && segmentField !== displayField && node.fields[segmentField]) {
                if (node.fields[segmentField].sha512sum) {
                    clone.fields[segmentField].fileName = this.addSuffixToString(node.fields[segmentField].fileName, suffix);
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

            return {
                key: binaryFieldKey,
                value: binaryFieldValue
            };
        }
    }

    private uploadBinaries(node: MeshNode, fields: FieldMapFromServer): Promise<MeshNode | void> {
        // if no binaries are present - return the same node
        if (Object.keys(fields).length === 0) {
            return Promise.resolve(node);
        }

        const promises = Object.keys(fields)
            .map(key => this.uploadBinary(node.project.name, node.uuid, key, fields[key].file, node.language, node.version));

        return Promise.all(promises)
            // return the node from the last successful request
            .then(nodes => nodes[nodes.length - 1])
            .catch(error => { throw { node, error }; });
    }

    private uploadBinary(project: string,
                         nodeUuid: string,
                         fieldName: string,
                         binary: File,
                         language: string,
                         version: string): Promise<MeshNode | void> {
        // TODO: remote lang lang: language from params.
        // It is currently needed to overcome the https://github.com/gentics/mesh/issues/404 issue
        // what it does now, it adds ?lang=language query param
        return this.api.project.updateBinaryField({
            project,
            nodeUuid,
            fieldName,
            lang: language
        } as any, {
            binary,
            language,
            version
        }).toPromise();
    }

    private applyBinaryTransforms(node: MeshNode, fields: FieldMapFromServer): Promise<MeshNode> {
        const project = node.project.name;
        const nodeUuid = node.uuid;
        const promises = Object.keys(fields)
            .filter(fieldName => !!fields[fieldName].transform)
            .map(fieldName => {
                const value = fields[fieldName] as BinaryField;
                const transform = value.transform;
                return this.api.project.transformBinaryField({
                    project,
                    nodeUuid,
                    fieldName
                }, {
                    version: node.version,
                    language: node.language,
                    width: transform.width,
                    height: transform.height,
                    cropRect: transform.cropRect
                }).toPromise();
            });

        if (!promises.length) {
            return Promise.resolve(node);
        }

        return Promise.all(promises)
            // return the node from the last successful request
            .then(nodes => nodes[nodes.length - 1])
            .catch(error => { throw { node, error }; });
    }
}
