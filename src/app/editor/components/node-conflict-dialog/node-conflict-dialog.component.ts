import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode } from '../../../common/models/node.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { BlobService } from '../../providers/blob.service';
import { tagsAreEqual, getJoinedTags } from '../../form-generator/common/tags-are-equal';


interface ConflictedField {
    field: SchemaField;
    mineValue: any;
    theirValue: any;
    overwrite: boolean;
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
    ) {}

    ngOnInit(): void {
        const schema: Schema = this.entities.getSchema(this.mineNode.schema.uuid);
        this.conflicts.map(fieldName => {
            const schemaField = schema.fields.find(field => field.name === fieldName);
            const mineField = this.mineNode.fields[schemaField.name];
            const theirField = this.theirsNode.fields[schemaField.name];
            switch (schemaField.type) {
                case 'binary':
                        this.conflictedFields.push({
                            field: schemaField,
                            mineValue: mineField.fileName,
                            theirValue: theirField.fileName,
                            overwrite: true
                         });
                break;

                case 'string':
                case 'number':
                        this.conflictedFields.push({
                            field: schemaField,
                            mineValue: mineField,
                            theirValue: theirField,
                            overwrite: true
                        });
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
        this.conflictedFields.map(conflictedField => {
            if (conflictedField.overwrite === true) {
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
