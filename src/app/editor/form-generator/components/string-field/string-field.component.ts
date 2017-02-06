import { Component } from '@angular/core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';

@Component({
    selector: 'string-field',
    templateUrl: './string-field.component.html',
    styleUrls: ['./string-field.scss']
})
export class StringFieldComponent implements SchemaFieldControl {

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
