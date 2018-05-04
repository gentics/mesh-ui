import { async, tick, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Notification } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { AuthEffectsService } from '../../../login/providers/auth-effects.service';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { I18nService } from '../../providers/i18n/i18n.service';

import { ChangePasswordModalComponent } from './change-password-modal.component';

describe('ChangePasswordModal', () => {
    let authEffectSpy: any;
    let notificationSpy: any;
    let appState: TestApplicationState;

    beforeEach(async(() => {
        notificationSpy = jasmine.createSpyObj('Notification', ['show']);
        authEffectSpy = jasmine.createSpyObj('AuthEffectsService', ['changePassword']);
        authEffectSpy.changePassword.and.returnValue(Promise.resolve());

        configureComponentTest({
            imports: [ReactiveFormsModule, SharedModule, TestStateModule],
            providers: [
                { provide: AuthEffectsService, useValue: authEffectSpy },
                { provide: Notification, useValue: notificationSpy },
                {
                    provide: I18nService,
                    useValue: {
                        translate(key: string) {
                            return key;
                        }
                    }
                }
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
        it(
            'should allow valid characters',
            componentTest(
                () => ChangePasswordModalComponent,
                fixture => {
                    fixture.detectChanges();
                    const instance: ChangePasswordModalComponent = fixture.componentInstance;
                    const password1 = instance.form.controls['password1'] as FormControl;

                    assertValid(password1, 'aA1._-@.');
                    assertValid(password1, '9922325');
                    assertValid(password1, 'two.words');
                    assertValid(password1, '--@@_._');
                }
            )
        );

        it(
            'should require both passwords to match',
            componentTest(
                () => ChangePasswordModalComponent,
                fixture => {
                    fixture.detectChanges();
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
                }
            )
        );

        it(
            'calls change password effect and shows a notification',
            componentTest(
                () => ChangePasswordModalComponent,
                fixture => {
                    fixture.detectChanges();
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
                    expect(authEffectSpy.changePassword).toHaveBeenCalledWith(
                        'd8b043e818144e27b043e81814ae2713',
                        'testpw'
                    );
                    expect(notificationSpy.show).toHaveBeenCalled();
                }
            )
        );
    });
});

// TODO Use some central utility function for this
function triggerEvent(element: HTMLElement, eventName: string) {
    const event = document.createEvent('Event');
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
