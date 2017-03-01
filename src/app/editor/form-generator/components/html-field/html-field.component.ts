import { Component } from '@angular/core';
import { SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'html-field',
    templateUrl: './html-field.component.html',
    styleUrls: ['./html-field.scss']
})
export class HtmlFieldComponent extends BaseFieldComponent {
    field: SchemaField;
    value: NodeFieldType;
    private path: SchemaFieldPath;
    private update: UpdateFunction;

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void {
        this.value = value;
        this.field = field;
        this.update = update;
        this.path = path;
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: string): void {
        if (typeof value === 'string') {
            this.update(this.path, value);
        }
    }
}
