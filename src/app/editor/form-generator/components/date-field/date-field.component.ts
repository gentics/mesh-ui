import { Component } from '@angular/core';
import { SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldDate } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.scss']
})
export class DateFieldComponent extends BaseFieldComponent {
    field: SchemaField;
    timestampValue: number;
    private path: SchemaFieldPath;
    private update: UpdateFunction;

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldDate, update: UpdateFunction): void {
        this.field = field;
        this.update = update;
        this.path = path;
        this.valueChange(value);
    }

    valueChange(value: NodeFieldDate): void {
        const date = new Date(value);
        this.timestampValue = date.getTime() / 1000;
    }

    onChange(value: number): void {
        if (typeof value === 'number') {
            const date = new Date(value * 1000);
            this.update(this.path, date.toISOString());
        }
    }
}
