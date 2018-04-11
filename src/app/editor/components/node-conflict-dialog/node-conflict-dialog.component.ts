import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode, BinaryField, NodeFieldMicronode } from '../../../common/models/node.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { BlobService } from '../../providers/blob.service';
import { tagsAreEqual, getJoinedTags } from '../../form-generator/common/tags-are-equal';
import { ApiService } from '../../../core/providers/api/api.service';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { ConflictedField } from '../../../common/models/common.model';

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
            /*const conflictedTags = {
                mineTags: getJoinedTags(this.mineNode.tags, 'name'),
                theirTags: getJoinedTags(this.theirsNode.tags, 'name')
            };*/

            const conflictedTags: ConflictedField = {
                field: {
                    type: '__TAGS__',
                    name: 'Tags'
                },
                mineValue: getJoinedTags(this.mineNode.tags, 'name'),
                theirValue: getJoinedTags(this.theirsNode.tags, 'name'),
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
                debugger;

                let f = this.conflictedFields.find(field => {
                    console.log('checking ', schemaField.name, fieldName);
                    return schemaField.name === fieldName;
                });

                console.log(f);


                const conflictingField = this.conflictedFields.find(field => schemaField.name === fieldName) || {
                    field: schemaField,
                    mineValue: mineField,
                    theirValue: theirField,
                    overwrite: false,
                    conflictedFields: []
                };

                const microSchema = this.entities.getMicroschema(mineField.microschema.uuid);
                const microNodeFieldName = conflictPath[1];
                const microSchemaField = microSchema.fields.find(field => field.name === microNodeFieldName);
                const mineMicroschemaField = (mineField as NodeFieldMicronode).fields[microNodeFieldName];
                const theirMicroschemaField = (theirField as NodeFieldMicronode).fields[microNodeFieldName];
                const conflictingMicroschemaField = this.getConflictedField(microSchemaField, mineMicroschemaField, theirMicroschemaField);
                console.log(conflictingField);
                conflictingField.conflictedFields.push(conflictingMicroschemaField);

            } else {
                this.conflictedFields.push(this.getConflictedField(schemaField, mineField, theirField));
            }
        });


        console.log(this.conflictedFields);
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

                // We preload the old version of the file in cate the user desides to overwrite the server version.
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

            case 'list':
                conflictedField = {
                    field: schemaField,
                    mineValue: mineField.join(', '),
                    theirValue: theirField.join(', '),
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
        this.conflictedFields.map(conflictedField => {
            if (conflictedField.overwrite === true) {
                if (conflictedField.field.type === '__TAGS__') {
                    // TODO:
                } else {
                    this.theirsNode.fields[conflictedField.field.name] = this.mineNode.fields[conflictedField.field.name];
                }
            }
        });
        this.closeFn(this.theirsNode);
    }

    registerCloseFn(close: (node: MeshNode) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }
}
