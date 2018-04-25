import { Component, Input } from '@angular/core';
import { ConflictedField } from '../../../common/models/common.model';

@Component({
    selector: 'mesh-conflicted-field',
    templateUrl: './conflicted-field.component.html',
    styleUrls: ['./conflicted-field.component.scss']
})
export class ConflictedFieldComponent {
    @Input() conflictedField: ConflictedField;
    constructor() { }


    log(ob: any) {
        console.log(ob);
    }
}
