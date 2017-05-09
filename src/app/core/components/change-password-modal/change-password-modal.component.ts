import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IModalDialog } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.scss']
})
export class ChangePasswordModalComponent implements IModalDialog {

    form: FormGroup;
    password1: FormControl;
    password2: FormControl;

    constructor() {

        const passwordValidators = [
            Validators.required
        ];

        this.password1 = new FormControl('', passwordValidators);
        this.password2 = new FormControl('', passwordValidators);

        this.form = new FormGroup({
            password1: this.password1,
            password2: this.password2
        }, this.areEqual);
    }

    /**
     * Validator which checks that both passwords contain equal values.
     */
    areEqual(group: FormGroup): { mustBeEqual: boolean } | null {
        let valid = group.get('password1').value === group.get('password2').value;
        if (valid) {
            return null;
        } else {
            return { mustBeEqual: true };
        }
    }

    changePassword(): void {
        if (this.form.valid) {
            // TODO call auth action and actually change password
            this.closeFn();
        }
    }

    closeFn = () => {};
    cancelFn = () => {};

    registerCloseFn(close: () => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: () => void): void {
        this.cancelFn = cancel;
    }
}
