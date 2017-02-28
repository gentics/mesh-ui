import { Component } from '@angular/core';
import { MeshFieldComponent, SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';

@Component({
    selector: 'boolean-field',
    templateUrl: 'boolean-field.component.html',
    styleUrls: ['boolean-field.scss']
})
export class BooleanFieldComponent implements MeshFieldComponent {

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
