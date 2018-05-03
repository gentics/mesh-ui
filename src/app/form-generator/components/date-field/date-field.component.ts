import { Component } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { DateField } from '../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.scss']
})
export class DateFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    timestampValue: number;

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
    }

    valueChange(value: DateField): void {
        const date = new Date(value);
        this.timestampValue = date.getTime() / 1000;
    }

    onChange(timestamp: number): void {
        if (typeof timestamp === 'number') {
            const date = new Date(timestamp * 1000);
            this.api.setValue(date.toISOString());
        }
    }
}
