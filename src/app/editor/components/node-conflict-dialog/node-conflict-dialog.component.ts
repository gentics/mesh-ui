import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode, BinaryField } from '../../../common/models/node.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { BlobService } from '../../providers/blob.service';
import { tagsAreEqual, getJoinedTags } from '../../form-generator/common/tags-are-equal';
import { ApiService } from '../../../core/providers/api/api.service';
import { ApiBase } from '../../../core/providers/api/api-base.service';


interface ConflictedField {
    field: SchemaField;
    mineValue: any;
    theirValue: any;
    overwrite: boolean;
    mineURL?: string | SafeUrl;
    theirURL?: string | SafeUrl;
    loading?: boolean;

}
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
        this.conflicts.map(conflict => {

            const conflictPath = conflict.split('.'); // Because we might have microschema fields defined by microschema.fieldName.
            const fieldName = conflictPath[0];

            const schemaField = schema.fields.find(field => field.name === fieldName);
            const mineField = this.mineNode.fields[schemaField.name];
            const theirField = this.theirsNode.fields[schemaField.name];

            switch (schemaField.type) {
                case 'binary':
                    const conflictedField = {
                        field: schemaField,
                        mineValue: mineField,
                        theirValue: theirField,
                        mineURL: (mineField as BinaryField).file
                            ? this.blobService.createObjectURL((mineField as BinaryField).file)
                            : this.apiService.project.getBinaryFileUrl(this.mineNode.project.name, this.mineNode.uuid, schemaField.name, this.mineNode.version),
                        theirURL: this.apiService.project.getBinaryFileUrl(this.theirsNode.project.name, this.theirsNode.uuid, schemaField.name, this.theirsNode.version),
                        overwrite: true
                    };

                    this.conflictedFields.push(conflictedField);

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
                    this.conflictedFields.push({
                        field: schemaField,
                        mineValue: mineField,
                        theirValue: theirField,
                        overwrite: true
                    });
                break;

                case 'list':
                    this.conflictedFields.push({
                        field: schemaField,
                        mineValue: mineField.join(', '),
                        theirValue: theirField.join(', '),
                        overwrite: true
                    });
                break;

                case 'micronode':
                    /*this.conflictedFields.push({
                        field: schemaField,
                        mineValue: mineField,
                        theirValue: theirField,
                        overwrite: true
                    });*/
                break;

                default:
                    this.conflictedFields.push({
                        field: schemaField,
                        mineValue: 'No Preview Available',
                        theirValue: 'No Preview Available',
                        overwrite: true
                    });
                break;
            }
        });
        if (!tagsAreEqual(this.theirsNode.tags, this.mineNode.tags)) {
            this.conflictedTags = {
                mineTags: getJoinedTags(this.mineNode.tags, 'name'),
                theirTags: getJoinedTags(this.theirsNode.tags, 'name')
            };
        }
    }

    saveAndClose(): void {
        /*this.api.project.downloadBinaryField({ project: this.node.project.name, nodeUuid: this.node.uuid, fieldName: 'binary', version: 1.42} ).subscribe(result => {
            console.log('got result', result);
        })
        return;*/

        this.conflictedFields.map(conflictedField => {
            if (conflictedField.overwrite === true) {
                /*switch (conflictedField.field.type) {
                    case 'binary':
                    break;
                    default:
                        this.theirsNode.fields[conflictedField.field.name] = this.mineNode.fields[conflictedField.field.name];
                    break;
                }*/

                this.theirsNode.fields[conflictedField.field.name] = this.mineNode.fields[conflictedField.field.name];
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
