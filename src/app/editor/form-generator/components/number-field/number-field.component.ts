import { Component } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'number-field',
    templateUrl: './number-field.component.html',
    styleUrls: ['./number-field.scss']
})
export class NumberFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue();
        this.api = api;
        this.setValidity(this.value);
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: number): void {
        this.api.setValue(value);
        this.setValidity(value);
    }

    /**
     * Mark as invalid if field is required and has a falsy value, or if min or max bounds are exceeded
     */
    private setValidity(value: any): void {
        const min = this.api.field.min;
        const max = this.api.field.max;
        let isValid = !this.api.field.required || (typeof value === 'number' && !Number.isNaN(value));
        if (min !== undefined && value < min) {
            isValid = false;
        }
        if (max !== undefined && max < value) {
            isValid = false;
        }
        this.api.setValid(isValid);
    }
}
