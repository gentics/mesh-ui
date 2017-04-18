import { Component } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'string-field',
    templateUrl: './string-field.component.html',
    styleUrls: ['./string-field.scss']
})
export class StringFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    value: NodeFieldType;

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue();
        this.api = api;
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: string): void {
        this.api.setValue(value);
    }

}
