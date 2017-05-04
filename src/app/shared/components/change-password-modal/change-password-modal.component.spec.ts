import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { async, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { ChangePasswordModalComponent } from './change-password-modal.component';
import { componentTest } from '../../../../testing/component-test';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { SharedModule } from '../../shared.module';

describe('ChangePasswordModal', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, ReactiveFormsModule, SharedModule],
            providers: [
                { provide: ApplicationStateService, useValue: {} }
            ],
            declarations: [ChangePasswordModalComponent]
        });
    }));

    describe('form validation', () => {

        it('should allow valid characters',  componentTest(() => ChangePasswordModalComponent, fixture => {
            const instance: ChangePasswordModalComponent = fixture.componentInstance;
            const password1 = instance.form.controls['password1'] as FormControl;

            assertValid(password1, 'aA1._-@.');
            assertValid(password1, '9922325');
            assertValid(password1, 'two.words');
            assertValid(password1, '--@@_._');
        }));

        it('should require both passwords to match',  componentTest(() => ChangePasswordModalComponent, fixture => {
            const instance: ChangePasswordModalComponent = fixture.componentInstance;
            const form = instance.form;
            const password1 = form.get('password1');
            const password2 = form.get('password2');
            fixture.detectChanges();

            password1!.setValue('abcde');
            password2!.setValue('abcdZ');
            form.updateValueAndValidity();
            expect(form.valid).toBe(false);

            password2!.setValue('abcde');
            form.updateValueAndValidity();
            expect(form.valid).toBe(true);

        }));
    });
});

function assertValid(passwordControl: FormControl, testString: string): void {
    passwordControl.setValue(testString);
    passwordControl.updateValueAndValidity();
    expect(passwordControl.valid).toBe(true, `test string: "${testString}"`);
}

function assertInvalid(passwordControl: FormControl, testString: string): void {
    passwordControl.setValue(testString);
    passwordControl.updateValueAndValidity();
    expect(passwordControl.valid).toBe(false, `test string: "${testString}"`);
}
