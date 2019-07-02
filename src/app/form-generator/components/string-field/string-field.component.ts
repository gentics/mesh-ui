import { Component } from '@angular/core';

import { NodeFieldType } from '../../../common/models/node.model';
import { errorHashFor, ErrorCode } from '../../common/form-errors';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-string-field',
    templateUrl: './string-field.component.html',
    styleUrls: ['./string-field.scss']
})
export class StringFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    value: NodeFieldType;

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue();
        this.api = api;
        this.setValidity(this.value);
    }

    valueChange(value: NodeFieldType): void {
        this.value = value;
    }

    onChange(value: string): void {
        this.api.setValue(value);
        this.setValidity(value);
    }

    /**
     * Mark as invalid if field is required and has a falsy value
     */
    private setValidity(value: any): void {
        const requiredError = this.api.field.required === true && !value;
        this.api.setError(errorHashFor('required', requiredError));
    }
}
