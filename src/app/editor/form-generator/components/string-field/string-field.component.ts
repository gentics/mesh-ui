import { Component } from '@angular/core';
import { SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'string-field',
    templateUrl: './string-field.component.html',
    styleUrls: ['./string-field.scss']
})
export class StringFieldComponent extends BaseFieldComponent {

    field: SchemaField;
    value: NodeFieldType;
    path: SchemaFieldPath;
    private update: UpdateFunction;

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void {
        this.value = value;
        this.update = update;
        this.field = field;
        this.path = path;
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: string): void {
        this.update(this.path, value);
    }

}
