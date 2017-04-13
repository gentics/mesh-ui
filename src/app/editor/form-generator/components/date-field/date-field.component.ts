import { Component } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldDate } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.scss']
})
export class DateFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    timestampValue: number;

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
        api.onValueChange(this.valueChange);
    }

    valueChange(value: NodeFieldDate): void {
        const date = new Date(value);
        this.timestampValue = date.getTime() / 1000;
    }

    onChange(value: number): void {
        if (typeof value === 'number') {
            const date = new Date(value * 1000);
            this.api.update(date.toISOString());
        }
    }
}
