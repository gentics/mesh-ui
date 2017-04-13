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
        api.onValueChange(this.valueChange);
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: string): void {
        this.api.update(value);
    }
}
