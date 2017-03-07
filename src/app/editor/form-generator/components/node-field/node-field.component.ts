import { Component } from '@angular/core';
import { SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldNode, NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'node-field',
    templateUrl: './node-field.component.html',
    styleUrls: ['./node-field.scss']
})
export class NodeFieldComponent extends BaseFieldComponent {
    value: NodeFieldType;
    field: SchemaField;
    userValue: string;
    private path: SchemaFieldPath;
    private update: UpdateFunction;

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldNode, update: UpdateFunction): void {
        this.update = update;
        this.field = field;
        this.path = path;
        this.valueChange(value);
    }

    valueChange(value: NodeFieldNode): void {
        this.userValue = value.uuid;
    }

    isValidUuid(): boolean {
        return this.userValue.length === 32;
    }

    doUpdate(): void {
        this.update(this.path, { uuid: this.userValue });
    }
}
