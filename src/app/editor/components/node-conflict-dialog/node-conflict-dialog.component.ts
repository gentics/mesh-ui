import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IModalDialog } from 'gentics-ui-core';
import { forkJoin } from 'rxjs';

import { ConflictedField, TAGS_FIELD_TYPE } from '../../../common/models/common.model';
import { BinaryField, MeshNode, NodeField, NodeFieldMicronode } from '../../../common/models/node.model';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { NodeResponse, TagReferenceFromServer } from '../../../common/models/server-models';
import { ApiService } from '../../../core/providers/api/api.service';
import { BlobService } from '../../../core/providers/blob/blob.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { getConstrainedDimensions } from '../../../shared/common/get-constrained-dimensions';
import { getFileType } from '../../../shared/common/get-file-type';
import { EntitiesService } from '../../../state/providers/entities.service';
import { getJoinedTags, tagsAreEqual } from '../../form-generator/common/tags-are-equal';
import { NodeEditorComponent } from '../node-editor/node-editor.component';

@Component({
    selector: 'mesh-node-conflict-dialog',
    templateUrl: './node-conflict-dialog.component.html',
    styleUrls: ['./node-conflict-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeConflictDialogComponent implements IModalDialog, OnInit {
    closeFn: (node: MeshNode) => void;
    cancelFn: (val?: any) => void;
    localNode: MeshNode; // Passed from the dialog opener.
    remoteNode: MeshNode; // Passed from the dialog opener.
    conflicts: string[]; // Passed from the dialog opener.
    localTags: TagReferenceFromServer[]; // Passed from the dialog opener.
    conflictedFields: ConflictedField[] = [];
    conflictedTags: { mineTags: string; theirTags: string } | null = null;
    overwriteTags = true;

    constructor(
        private i18n: I18nService,
        private entities: EntitiesService,
        private blobService: BlobService,
        private apiService: ApiService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const schema = this.entities.getSchema(this.localNode.schema.uuid!) as Schema;
        if (!tagsAreEqual(this.remoteNode.tags, this.localTags)) {
            const conflictedTags: ConflictedField = {
                field: {
                    type: TAGS_FIELD_TYPE,
                    name: 'Tags'
                },
                localValue: getJoinedTags(this.localTags, 'name', ', '),
                remoteValue: getJoinedTags(this.remoteNode.tags, 'name', ', '),
                overwrite: true
            };
            this.conflictedFields.push(conflictedTags);
        }

        this.conflicts.map(conflict => {
            const conflictPath = conflict.split('.'); // Because we might have microschema fields defined by microschema.fieldName.
            const fieldName = conflictPath[0];

            const schemaField = schema.fields.find(field => field.name === fieldName);
            if (!schemaField) {
                throw new Error(`Could not find a schema field "${fieldName}"`);
            }
            if (schemaField.type === 'micronode') {
                this.handleConflictedMicroNode(schemaField, conflictPath[1]);
            } else {
                this.conflictedFields.push(
                    this.getConflictedField(
                        schemaField,
                        this.localNode.fields[schemaField.name],
                        this.remoteNode.fields[schemaField.name]
                    )
                );
            }
        });
    }

    private handleConflictedMicroNode(schemaField: SchemaField, microNodeFieldName: string): void {
        const localField = this.localNode.fields[schemaField.name];
        const remoteField = this.remoteNode.fields[schemaField.name];

        // If this micronode had conflicts already - it will be already pushed onto this.conflictedFields array, so we can take it and continue working with it
        // Otherwise we create a new object and push it onto this.conflictedFields
        let conflictingField = this.conflictedFields.find(field => field.field.name === schemaField.name);
        if (!conflictingField) {
            // Othwerwise we create an new object for it
            conflictingField = {
                field: schemaField,
                localValue: localField,
                remoteValue: remoteField,
                overwrite: true,
                conflictedFields: []
            };
            this.conflictedFields.push(conflictingField);
        }

        const microSchema = this.entities.getMicroschema(localField.microschema.uuid);
        if (!microSchema) {
            throw new Error(`Could not find Microschema with the uuid ${localField.microschema.uuid}`);
        }
        const microSchemaField = microSchema.fields.find(field => field.name === microNodeFieldName);
        if (!microSchemaField) {
            throw new Error(`Could not find micronode field "${microNodeFieldName}"`);
        }
        const localMicroschemaField = (localField as NodeFieldMicronode).fields[microNodeFieldName];
        const remoteMicroschemaField = (remoteField as NodeFieldMicronode).fields[microNodeFieldName];
        const conflictingMicroschemaField = this.getConflictedField(
            microSchemaField,
            localMicroschemaField,
            remoteMicroschemaField
        );

        if (Array.isArray(conflictingField.conflictedFields)) {
            conflictingField.conflictedFields.push(conflictingMicroschemaField);
        }
    }

    private getConflictedField(schemaField: SchemaField, localField: any, remoteField: any): ConflictedField {
        let conflictedField: ConflictedField;

        switch (schemaField.type) {
            case 'binary':
                const file = (localField as BinaryField).file;
                conflictedField = {
                    field: schemaField,
                    localValue: localField,
                    remoteValue: remoteField,
                    localURL: file
                        ? this.blobService.createObjectURL(file)
                        : this.getBinaryUrl(this.localNode, schemaField.name, localField as BinaryField),
                    remoteURL: this.getBinaryUrl(this.remoteNode, schemaField.name, remoteField as BinaryField),
                    overwrite: true
                };

                // We preload the old version of the file in case the user desides to overwrite the server version.
                if (!(localField as BinaryField).file) {
                    // Only download the server version if the user did NOT actually select a new file
                    const url = this.apiService.project.getBinaryFileUrl(
                        this.localNode.project.name!,
                        this.localNode.uuid,
                        schemaField.name,
                        this.localNode.language!,
                        this.localNode.version,
                        { w: 200, h: 200 }
                    );

                    this.blobService.downloadFile(url, (localField as BinaryField).fileName).then((file: File) => {
                        (localField as BinaryField).file = file;
                    });
                }
                break;

            case 'string':
            case 'number':
            case 'boolean':
            case 'html':
            case 'date':
                conflictedField = {
                    field: schemaField,
                    localValue: localField,
                    remoteValue: remoteField,
                    overwrite: true
                };
                break;

            case 'node':
                conflictedField = {
                    field: schemaField,
                    localValue: (localField as NodeField).uuid,
                    remoteValue: (remoteField as NodeField).uuid,
                    overwrite: true
                };

                // Download the nodes so that we can display it's data in the diff
                forkJoin(
                    this.apiService.project.getNode({
                        project: this.localNode.project.name!,
                        nodeUuid: (localField as NodeField).uuid
                    }),
                    this.apiService.project.getNode({
                        project: this.remoteNode.project.name!,
                        nodeUuid: (remoteField as NodeField).uuid
                    })
                ).subscribe(([localNode, remoteNode]) => {
                    conflictedField.localValue = this.getBreadcrumbPathString(localNode);
                    conflictedField.remoteValue = this.getBreadcrumbPathString(remoteNode);
                    this.changeDetector.markForCheck();
                });
                break;

            case 'list':
                conflictedField = {
                    field: schemaField,
                    localValue: localField.join('<br />'),
                    remoteValue: remoteField.join('<br />'),
                    overwrite: true
                };
                break;
            case 'micronode':
            default:
                conflictedField = {
                    field: schemaField,
                    localValue: this.i18n.translate('no_preview_available'),
                    remoteValue: this.i18n.translate('no_preview_available'),
                    overwrite: true
                };
                break;
        }

        return conflictedField;
    }

    private getBinaryUrl(node: MeshNode, schemaFieldName: string, field: BinaryField): string {
        if (
            getFileType(field.mimeType, field.fileName) === 'image' &&
            field.width !== undefined &&
            field.height !== undefined
        ) {
            const { width, height } = getConstrainedDimensions(field.width, field.height, 500, 270);
            return this.apiService.project.getBinaryFileUrl(
                node.project.name!,
                node.uuid,
                schemaFieldName,
                node.language!,
                node.version,
                { w: width, h: height }
            );
        } else {
            return this.apiService.project.getBinaryFileUrl(
                node.project.name!,
                node.uuid,
                schemaFieldName,
                node.language!,
                node.version
            );
        }
    }

    saveAndClose(): void {
        // The final node will contain all our fields (because we might have had changes
        // that are not marked by the mesh as a conflict) and we will just overwrite the
        // values with the remote values if it was indicated by the user.
        const tagsField = this.conflictedFields.find(f => f.overwrite === false && f.field.type === TAGS_FIELD_TYPE);
        const mergedNode = {
            ...this.remoteNode,
            fields: this.localNode.fields,
            tags: tagsField ? this.remoteNode.tags : this.localTags
        };

        this.conflictedFields.map(conflictedField => {
            if (conflictedField.overwrite === false && conflictedField.field.type !== TAGS_FIELD_TYPE) {
                // Overwrute means 'overwrite the serer version with ours. So if it's false - we take the server version and dump it into our mergeNode
                if (conflictedField.field.type === 'micronode' && conflictedField.conflictedFields) {
                    conflictedField.conflictedFields.map(conflictedMicronodeField => {
                        if (conflictedMicronodeField.overwrite === false) {
                            mergedNode.fields[conflictedField.field.name].fields[
                                conflictedMicronodeField.field.name
                            ] = this.remoteNode.fields[conflictedField.field.name].fields[
                                conflictedMicronodeField.field.name
                            ];
                        }
                    });
                } else {
                    mergedNode.fields[conflictedField.field.name] = this.remoteNode.fields[conflictedField.field.name];
                }
            }
        });
        this.closeFn(mergedNode);
    }

    registerCloseFn(close: (node: MeshNode) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    /**
     * Converts the path of the node into a slash-separated string
     */
    private getBreadcrumbPathString(node: MeshNode): string {
        return node.breadcrumb
            .map(crumb => crumb.displayName)
            .concat(node.displayName)
            .join('/');
    }
}
