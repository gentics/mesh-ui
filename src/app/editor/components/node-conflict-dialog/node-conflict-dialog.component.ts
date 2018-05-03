import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode, BinaryField, NodeFieldMicronode, NodeField } from '../../../common/models/node.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { tagsAreEqual, getJoinedTags } from '../../form-generator/common/tags-are-equal';
import { ApiService } from '../../../core/providers/api/api.service';
import { ConflictedField, TAGS_FIELD_TYPE } from '../../../common/models/common.model';
import { TagReferenceFromServer, NodeResponse } from '../../../common/models/server-models';
import { BlobService } from '../../../core/providers/blob/blob.service';


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
    conflictedTags: {mineTags: string, theirTags: string} = null;
    overwriteTags = true;

    constructor(
        private i18n: I18nService,
        private entities: EntitiesService,
        private blobService: BlobService,
        private apiService: ApiService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const schema: Schema = this.entities.getSchema(this.localNode.schema.uuid);
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
            if (schemaField.type === 'micronode') {
                this.handleConflictedMicroNode(schemaField, conflictPath[1]);
            } else {
                this.conflictedFields.push(this.getConflictedField(schemaField, this.localNode.fields[schemaField.name], this.remoteNode.fields[schemaField.name]));
            }
        });
    }

    private handleConflictedMicroNode(schemaField: SchemaField, microNodeFieldName: string): void {
        const localField = this.localNode.fields[schemaField.name];
        const remoteField = this.remoteNode.fields[schemaField.name];

         // If this micronode had conflicts already - it will be already pushed onto this.conflictedFields array, so we can take it and continue working with it
         // Otherwise we create a new object and push it onto this.conflictedFields
        let conflictingField = this.conflictedFields.find(field => field.field.name === schemaField.name);
        if (!conflictingField) { // Othwerwise we create an new object for it
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
        const microSchemaField = microSchema.fields.find(field => field.name === microNodeFieldName);
        const localMicroschemaField = (localField as NodeFieldMicronode).fields[microNodeFieldName];
        const remoteMicroschemaField = (remoteField as NodeFieldMicronode).fields[microNodeFieldName];
        const conflictingMicroschemaField = this.getConflictedField(microSchemaField, localMicroschemaField, remoteMicroschemaField);
        conflictingField.conflictedFields.push(conflictingMicroschemaField);
    }

    private getConflictedField(schemaField: SchemaField, localField: any, remoteField: any): ConflictedField {
        let conflictedField: ConflictedField = null;

        switch (schemaField.type) {
            case 'binary':
                conflictedField = {
                    field: schemaField,
                    localValue: localField,
                    remoteValue: remoteField,
                    localURL: (localField as BinaryField).file
                        ? this.blobService.createObjectURL((localField as BinaryField).file)
                        : this.apiService.project.getBinaryFileUrl(this.localNode.project.name, this.localNode.uuid, schemaField.name, this.localNode.version, {w: 200, h: 200}),
                    remoteURL: this.apiService.project.getBinaryFileUrl(this.remoteNode.project.name, this.remoteNode.uuid, schemaField.name, this.remoteNode.version, { w: 200, h: 200}),
                    overwrite: true
                };

                // We preload the old version of the file in case the user desides to overwrite the server version.
                if (!(localField as BinaryField).file) { // Only download the server version if the user did NOT actually select a new file
                    const url = this.apiService.project.getBinaryFileUrl(this.localNode.project.name, this.localNode.uuid, schemaField.name, this.localNode.version, {w: 200,h: 200})

                    this.blobService.downloadFile(url, (localField as BinaryField).fileName)
                        .then((file: File) => {
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
                    overwrite: true,
                };

                // Download the nodes so that we can display it's data in the diff
                forkJoin(this.apiService.project.getNode({ project: this.localNode.project.name, nodeUuid: (localField as NodeField).uuid}),
                        this.apiService.project.getNode({ project: this.remoteNode.project.name, nodeUuid: (remoteField as NodeField).uuid}))
                    .subscribe((results: NodeResponse[] ) => {
                        conflictedField.localValue = results[0].breadcrumb.map(crumb => crumb.displayName + '/') + results[0].displayName;
                        conflictedField.remoteValue = results[1].breadcrumb.map(crumb => crumb.displayName + '/') + results[1].displayName;

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

    saveAndClose(): void {
        // The final node will contain all our fields (because we might have had changes
        // that are not marked by the mesh as a conflict) and we will just overwrite the
        // values with the remote values if it was indicated by the user.
        const tagsField = this.conflictedFields.find(f => f.overwrite === false && f.field.type === TAGS_FIELD_TYPE);
        const mergedNode = {...this.remoteNode, fields: this.localNode.fields, tags: tagsField ? this.remoteNode.tags : this.localTags};

        this.conflictedFields.map(conflictedField => {
            if (conflictedField.overwrite === false && conflictedField.field.type !== TAGS_FIELD_TYPE) { // Overwrute means 'overwrite the serer version with ours. So if it's false - we take the server version and dump it into our mergeNode
                if (conflictedField.field.type === 'micronode') {
                    conflictedField.conflictedFields.map(conflictedMicronodeField => {
                        if (conflictedMicronodeField.overwrite === false) {
                            mergedNode.fields[conflictedField.field.name].fields[conflictedMicronodeField.field.name] = this.remoteNode.fields[conflictedField.field.name].fields[conflictedMicronodeField.field.name];
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
}
