import { Component } from '@angular/core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldDate } from '../../../../common/models/node.model';

@Component({
    selector: 'date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.scss']
})
export class DateFieldComponent implements SchemaFieldControl {
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
