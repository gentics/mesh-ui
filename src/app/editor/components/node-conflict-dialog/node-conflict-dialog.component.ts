import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode } from '../../../common/models/node.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { BlobService } from '../../providers/blob.service';


interface ConflictedField {
    field: SchemaField;
    mineValue: any;
    theirValue: any;
}
@Component({
    selector: 'mesh-node-conflict-dialog',
    templateUrl: './node-conflict-dialog.component.html',
    styleUrls: ['./node-conflict-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeConflictDialogComponent implements IModalDialog, OnInit {
    closeFn: (result: boolean) => void;
    cancelFn: (val?: any) => void;
    mineNode: MeshNode;
    theirsNode: MeshNode;

    conflictedFields: ConflictedField[] = [];

    constructor(
        private i18n: I18nService,
        private entities: EntitiesService,
        private blobService: BlobService,
    ) {}

    ngOnInit(): void {
        const schema: Schema = this.entities.getSchema(this.mineNode.schema.uuid);
        schema.fields.map(schemaField => {
            const mineField = this.mineNode.fields[schemaField.name];
            const theirField = this.theirsNode.fields[schemaField.name];
            switch (schemaField.type) {
                case 'binary':
                    if (mineField.fileName !== theirField.fileName) {
                        this.conflictedFields.push({
                            field: schemaField,
                            mineValue: mineField.fileName,
                            theirValue: theirField.fileName
                         });
                    }
                break;

                case 'string':
                case 'number':
                    if (mineField !== theirField) {
                        this.conflictedFields.push({
                            field: schemaField,
                            mineValue: mineField,
                            theirValue: theirField
                        });
                    }
                break;

                default:
                    this.conflictedFields.push({
                        field: schemaField,
                        mineValue: 'No Preview Available',
                        theirValue: 'No Preview Available'
                    })
                break;
            }
        });
    }

    saveAndClose(): void {
        this.closeFn(true);
    }

    registerCloseFn(close: (val: boolean) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }
}
