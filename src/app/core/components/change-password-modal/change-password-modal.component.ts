import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IModalDialog, Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs';

import { AuthEffectsService } from '../../../login/providers/auth-effects.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { I18nService } from '../../providers/i18n/i18n.service';

@Component({
    selector: 'mesh-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.scss']
})
export class ChangePasswordModalComponent implements IModalDialog, OnInit {
    form: FormGroup;
    password1: FormControl;
    password2: FormControl;

    passwordChanging$: Observable<boolean>;

    constructor(
        private effects: AuthEffectsService,
        private state: ApplicationStateService,
        private notification: Notification,
        private i18n: I18nService
    ) {}

    ngOnInit(): void {
        const passwordValidators = [Validators.required];

        this.password1 = new FormControl('', passwordValidators);
        this.password2 = new FormControl('', passwordValidators);

        this.form = new FormGroup(
            {
                password1: this.password1,
                password2: this.password2
            },
            this.areEqual
        );

        this.passwordChanging$ = this.state.select(state => state.auth.changingPassword);
    }

    /**
     * Validator which checks that both passwords contain equal values.
     */
    areEqual(group: FormGroup): { mustBeEqual: boolean } | null {
        const valid = group.get('password1')!.value === group.get('password2')!.value;
        if (valid) {
            return null;
        } else {
            return { mustBeEqual: true };
        }
    }

    changePassword(): void {
        const user = this.state.now.auth.currentUser;
        if (this.form.valid) {
            if (!user) {
                // TODO Happens when user logged out while in this dialog. Can this actually happen?
                this.closeFn();
                return;
            }

            this.effects.changePassword(user, this.password1.value).then(() => {
                this.notification.show({
                    type: 'success',
                    message: this.i18n.translate('modal.change_password_success')
                });
                this.closeFn();
            });
        }
    }

    closeFn = (val?: any) => {};
    cancelFn = (val?: any) => {};

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }
}
