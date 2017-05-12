import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { async, TestBed, tick } from '@angular/core/testing';
import { GenticsUICoreModule, Notification } from 'gentics-ui-core';

import { ChangePasswordModalComponent } from './change-password-modal.component';
import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { SharedModule } from '../../../shared/shared.module';
import { UserEffectsService } from '../../providers/user-effects.service';
import { CoreModule } from '../../core.module';
import { I18nService } from '../../../shared/providers/i18n/i18n.service';
import { MockAppState, TestApplicationState } from '../../../state/testing/test-application-state.mock';

describe('ChangePasswordModal', () => {

    let userEffectSpy;
    let notificationSpy;
    let appState: TestApplicationState;


    beforeEach(async(() => {
        notificationSpy = jasmine.createSpyObj('Notification', ['show']);
        userEffectSpy = jasmine.createSpyObj('UserEffects', ['changePassword']);
        userEffectSpy.changePassword.and.returnValue(Promise.resolve());

        configureComponentTest({
            imports: [ReactiveFormsModule, SharedModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: UserEffectsService, useValue: userEffectSpy },
                { provide: Notification, useValue: notificationSpy },
                { provide: I18nService, useValue: { translate(key) { return key; } } }
            ],
            declarations: [ChangePasswordModalComponent]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            auth: {
                currentUser: 'd8b043e818144e27b043e81814ae2713'
            }
        });
    });


    describe('form validation', () => {

        it('should allow valid characters', componentTest(() => ChangePasswordModalComponent, fixture => {
            const instance: ChangePasswordModalComponent = fixture.componentInstance;
            const password1 = instance.form.controls['password1'] as FormControl;

            assertValid(password1, 'aA1._-@.');
            assertValid(password1, '9922325');
            assertValid(password1, 'two.words');
            assertValid(password1, '--@@_._');
        }));

        it('should require both passwords to match', componentTest(() => ChangePasswordModalComponent, fixture => {
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

        it('calls change password effect and shows a notification',
            componentTest(() => ChangePasswordModalComponent, fixture => {
                const instance: ChangePasswordModalComponent = fixture.componentInstance;
                const form = instance.form;
                const password1 = form.get('password1');
                const password2 = form.get('password2');
                fixture.detectChanges();

                password1!.setValue('testpw');
                password2!.setValue('testpw');
                form.updateValueAndValidity();
                fixture.detectChanges();

                triggerEvent(fixture.nativeElement.querySelector('gtx-button[type="primary"]'), 'click');
                fixture.detectChanges();
                tick();
                expect(userEffectSpy.changePassword).toHaveBeenCalledWith('d8b043e818144e27b043e81814ae2713', 'testpw');
                expect(notificationSpy.show).toHaveBeenCalled();
            })
        );
    });
});

// TODO Use some central utility function for this
function triggerEvent(element: HTMLElement, eventName: string) {
    let event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
}

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
