import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode, BinaryField, NodeFieldMicronode, NodeField } from '../../../common/models/node.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { BlobService } from '../../providers/blob.service';
import { tagsAreEqual, getJoinedTags } from '../../form-generator/common/tags-are-equal';
import { ApiService } from '../../../core/providers/api/api.service';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { ConflictedField } from '../../../common/models/common.model';
import { TagReferenceFromServer } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-node-conflict-dialog',
    templateUrl: './node-conflict-dialog.component.html',
    styleUrls: ['./node-conflict-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeConflictDialogComponent implements IModalDialog, OnInit {
    closeFn: (node: MeshNode) => void;
    cancelFn: (val?: any) => void;
    mineNode: MeshNode; // Passed from the dialog opener.
    theirsNode: MeshNode; // Passed from the dialog opener.
    conflicts: string[]; // Passed from the dialog opener.
    mineTags: TagReferenceFromServer[]; // Passed from the dialog opener.
    conflictedFields: ConflictedField[] = [];
    conflictedTags: {mineTags: string, theirTags: string} = null;
    overwriteTags = true;

    constructor(
        private i18n: I18nService,
        private entities: EntitiesService,
        private blobService: BlobService,
        private apiService: ApiService,
        private changeDetector: ChangeDetectorRef,
        private apiBase: ApiBase,
        private httpClient: HttpClient,
    ) {}

    ngOnInit(): void {

        const schema: Schema = this.entities.getSchema(this.mineNode.schema.uuid);

        if (!tagsAreEqual(this.theirsNode.tags, this.mineNode.tags)) {
            const conflictedTags: ConflictedField = {
                field: {
                    type: '__TAGS__',
                    name: 'Tags'
                },
                mineValue: getJoinedTags(this.mineTags, 'name', ', '),
                theirValue: getJoinedTags(this.theirsNode.tags, 'name', ', '),
                overwrite: true
            };

            this.conflictedFields.push(conflictedTags);
        }

        this.conflicts.map(conflict => {
            const conflictPath = conflict.split('.'); // Because we might have microschema fields defined by microschema.fieldName.
            const fieldName = conflictPath[0];

            const schemaField = schema.fields.find(field => field.name === fieldName);
            const mineField = this.mineNode.fields[schemaField.name];
            const theirField = this.theirsNode.fields[schemaField.name];

            if (schemaField.type === 'micronode') {
                let conflictingField = this.conflictedFields.find(field => field.field.name === fieldName);
                if (!conflictingField) {
                    conflictingField = {
                        field: schemaField,
                        mineValue: mineField,
                        theirValue: theirField,
                        overwrite: true,
                        conflictedFields: []
                    };
                    this.conflictedFields.push(conflictingField);
                }

                const microSchema = this.entities.getMicroschema(mineField.microschema.uuid);
                const microNodeFieldName = conflictPath[1];
                const microSchemaField = microSchema.fields.find(field => field.name === microNodeFieldName);
                const mineMicroschemaField = (mineField as NodeFieldMicronode).fields[microNodeFieldName];
                const theirMicroschemaField = (theirField as NodeFieldMicronode).fields[microNodeFieldName];
                const conflictingMicroschemaField = this.getConflictedField(microSchemaField, mineMicroschemaField, theirMicroschemaField);
                conflictingField.conflictedFields.push(conflictingMicroschemaField);
            } else {
                this.conflictedFields.push(this.getConflictedField(schemaField, mineField, theirField));
            }
        });
    }


    getConflictedField(schemaField: SchemaField, mineField: any, theirField: any): ConflictedField {
        let conflictedField = null;

        switch (schemaField.type) {
            case 'binary':
                conflictedField = {
                    field: schemaField,
                    mineValue: mineField,
                    theirValue: theirField,
                    mineURL: (mineField as BinaryField).file
                        ? this.blobService.createObjectURL((mineField as BinaryField).file)
                        : this.apiService.project.getBinaryFileUrl(this.mineNode.project.name, this.mineNode.uuid, schemaField.name, this.mineNode.version),
                    theirURL: this.apiService.project.getBinaryFileUrl(this.theirsNode.project.name, this.theirsNode.uuid, schemaField.name, this.theirsNode.version),
                    overwrite: true
                };

                // We preload the old version of the file in case the user desides to overwrite the server version.
                if (!(mineField as BinaryField).file) { // Only download the server version if the user did NOT actually select a new file
                    const url = this.apiBase.formatUrl('/{project}/nodes/{nodeUuid}/binary/{fieldName}', {
                        project: this.mineNode.project.name,
                        nodeUuid: this.mineNode.uuid,
                        fieldName: schemaField.name,
                        version: this.mineNode.version,
                    });

                    this.httpClient.get(url, { observe: 'response', responseType: 'blob'})
                        .subscribe(result => {
                            (mineField as BinaryField).file = new File([result.body], (mineField as BinaryField).fileName, { type: result.body.type});
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
                    mineValue: mineField,
                    theirValue: theirField,
                    overwrite: true
                };
            break;

            case 'node':
                conflictedField = {
                    field: schemaField,
                    mineValue: (mineField as NodeField).uuid,
                    theirValue: (theirField as NodeField).uuid,
                    overwrite: true,
                    preload: true,
                };

                // Download the nodes so that we can display it's data in the diff
                this.apiService.project.getNode({ project: this.mineNode.project.name, nodeUuid: (mineField as NodeField).uuid})
                    .subscribe(node => {
                        conflictedField.mineValue = node.breadcrumb.map(crumb => crumb.displayName + '/') + node.displayName;
                        this.changeDetector.markForCheck();
                    });

                this.apiService.project.getNode({ project: this.mineNode.project.name, nodeUuid: (theirField as NodeField).uuid})
                    .subscribe(node => {
                        conflictedField.theirValue = node.breadcrumb.map(crumb => crumb.displayName + '/') + node.displayName;
                        this.changeDetector.markForCheck();
                    });
            break;

            case 'list':
                conflictedField = {
                    field: schemaField,
                    mineValue: mineField.join('<br />'),
                    theirValue: theirField.join('<br />'),
                    overwrite: true
                };
            break;

            default:
                conflictedField = {
                    field: schemaField,
                    mineValue: 'No Preview Available',
                    theirValue: 'No Preview Available',
                    overwrite: true
                };
            break;
        }

        return conflictedField;
    }

    saveAndClose(): void {
        // The final node will contain all out fields (because we might have had changes
        // that are not marked by the mesh as a conflict) and we will just overwrite the
        // values with the their values of it was indicated by the user.
        const tagsField = this.conflictedFields.find(f => f.overwrite === false && f.field.type === '__TAGS__');
        const mergedNode = {...this.theirsNode, fields: this.mineNode.fields, tags: tagsField !== null ? this.mineTags : this.theirsNode.tags };

        this.conflictedFields.map(conflictedField => {
            if (conflictedField.overwrite === false) { // Overwrute means 'overwrite the serer version with ours. So if it's false - we take the server version and dump it into our mergeNode
                if (conflictedField.field.type === 'micronode') {
                    conflictedField.conflictedFields.map(conflictedMicronodeField => {
                        if (conflictedMicronodeField.overwrite === false) {
                            mergedNode.fields[conflictedField.field.name].fields[conflictedMicronodeField.field.name] = this.theirsNode.fields[conflictedField.field.name].fields[conflictedMicronodeField.field.name];
                        }
                    });
                } else {
                    mergedNode.fields[conflictedField.field.name] = this.theirsNode.fields[conflictedField.field.name];
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
