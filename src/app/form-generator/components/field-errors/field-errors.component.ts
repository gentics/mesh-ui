import { Component } from '@angular/core';

import { MeshControlErrors } from '../../common/form-generator-models';

@Component({
    selector: 'mesh-field-errors',
    templateUrl: './field-errors.component.html',
    styleUrls: ['./field-errors.scss']
})
export class FieldErrorsComponent {
    errors: MeshControlErrors = {};

    get errorMessages(): string[] {
        return Object.keys(this.errors).map(code => this.errors[code]);
    }
}
