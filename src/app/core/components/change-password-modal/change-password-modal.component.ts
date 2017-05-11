import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IModalDialog } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { UserEffectsService } from '../../providers/user-effects.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.scss']
})
export class ChangePasswordModalComponent implements IModalDialog {

    form: FormGroup;
    password1: FormControl;
    password2: FormControl;

    passwordChanging$: Observable<boolean>;

    constructor(private effects: UserEffectsService,
                private state: ApplicationStateService) {

        const passwordValidators = [
            Validators.required
        ];

        this.password1 = new FormControl('', passwordValidators);
        this.password2 = new FormControl('', passwordValidators);

        this.form = new FormGroup({
            password1: this.password1,
            password2: this.password2
        }, this.areEqual);

        this.passwordChanging$ = this.state.select(state => state.admin.changingPassword);

        // Close when password has changed
        this.passwordChanging$
            // Skip initial state
            .skip(1)
            .filter(changing => !changing)
            .take(1)
            .subscribe(() => {
                this.closeFn();
            });
    }

    /**
     * Validator which checks that both passwords contain equal values.
     */
    areEqual(group: FormGroup): { mustBeEqual: boolean } | null {
        let valid = group.get('password1')!.value === group.get('password2')!.value;
        if (valid) {
            return null;
        } else {
            return { mustBeEqual: true };
        }
    }

    changePassword(): void {
        let user = this.state.now.auth.currentUser;
        if (this.form.valid) {
            if (!user) {
                // TODO Happens when user logged out while in this dialog. Can this actually happen?
                this.closeFn();
                return;
            }

            this.effects.changePassword(user, this.password1.value);
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
