import { Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Button, Icon, InputField } from 'gentics-ui-core';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { mockMeshNode, mockSchema } from '../../../../testing/mock-models';
import { MockActivatedRoute } from '../../../../testing/router-testing-mocks';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { MockFormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component.mock';
import { MockProjectContentDirective } from '../../../shared/directives/project-content.directive.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';

import { UserDetailComponent } from './user-detail.component';

describe('UserDetailComponent', () => {
    let instance: UserDetailComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let state: TestApplicationState;
    let activatedRoute: MockActivatedRoute;

    beforeEach(async(() => {
        configureComponentTest({
            declarations: [
                TestHostComponent,
                UserDetailComponent,
                InputField,
                Button,
                Icon,
                MockFormGeneratorComponent,
                MockProjectContentDirective
            ],
            imports: [RouterTestingModule.withRoutes([]), ReactiveFormsModule, TestStateModule],
            providers: [
                { provide: AdminUserEffectsService, useClass: MockAdminUserEffectsService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: NavigationService, useClass: MockNavigationService }
            ]
        });

        state = TestBed.get(ApplicationStateService);
        activatedRoute = TestBed.get(ActivatedRoute);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.debugElement.query(By.directive(UserDetailComponent)).componentInstance;
    });

    it('should create', () => {
        expect(instance).toBeTruthy();
    });

    it('does not display the FormGenerator if user does not have a nodeReference', () => {
        activatedRoute.setData('user', {
            uuid: 'user_uuid',
            permissions: {}
        });
        fixture.detectChanges();

        const formGenerator = getFormGenerator(fixture);
        expect(formGenerator === null).toBe(true);
    });

    it('displays the FormGenerator if user has a nodeReference', () => {
        setStateForUserWithNodeReference(activatedRoute, state);
        fixture.detectChanges();

        const formGenerator = getFormGenerator(fixture);
        expect(formGenerator === null).toBe(false);
    });

    describe('save button', () => {
        describe('for user without nodeReference', () => {
            beforeEach(() => {
                activatedRoute.setData('user', {
                    uuid: 'user_uuid',
                    permissions: { update: true }
                });
                fixture.detectChanges();
            });

            it('is initially disabled', () => {
                expect(instance.isSaveButtonEnabled()).toBe(false);
            });

            it('is enabled if the form is dirty and valid', () => {
                fixture.detectChanges();
                instance.form.patchValue(
                    {
                        userName: 'some_user'
                    },
                    { emitEvent: true }
                );
                instance.form.markAsDirty();

                // Cannot currently test the actual save button in the DOM due to this issue:
                // https://github.com/angular/angular/issues/12313#issuecomment-384926337
                // const saveButton = getSaveButton(fixture);
                // expect(saveButton.disabled).toBe(false);

                expect(instance.isSaveButtonEnabled()).toBe(true);
            });

            it('is disabled if the form is dirty and invalid', () => {
                fixture.detectChanges();
                instance.form.patchValue(
                    {
                        userName: ''
                    },
                    { emitEvent: true }
                );
                instance.form.markAsDirty();

                expect(instance.isSaveButtonEnabled()).toBe(false);
            });
        });

        describe('for user with nodeReference', () => {
            beforeEach(() => {
                setStateForUserWithNodeReference(activatedRoute, state);
                fixture.detectChanges();
            });

            it('is initially disabled', () => {
                const formGenerator = getFormGenerator(fixture);
                formGenerator.isDirty = false;
                expect(instance.isSaveButtonEnabled()).toBe(false);
            });

            it('is enabled when form dirty & valid, formGenerator pristine', () => {
                const formGenerator = getFormGenerator(fixture);

                instance.form.patchValue(
                    {
                        userName: 'some_user'
                    },
                    { emitEvent: true }
                );
                instance.form.markAsDirty();
                formGenerator.isDirty = false;
                formGenerator.isValid = true;

                expect(instance.isSaveButtonEnabled()).toBe(true);
            });

            it('is enabled when form pristine, formGenerator dirty & valid', () => {
                const formGenerator = getFormGenerator(fixture);
                formGenerator.isDirty = true;
                formGenerator.isValid = true;

                expect(instance.isSaveButtonEnabled()).toBe(true);
            });
            it('is disabled when form pristine, formGenerator dirty & invalid', () => {
                const formGenerator = getFormGenerator(fixture);
                formGenerator.isDirty = true;
                formGenerator.isValid = false;

                expect(instance.isSaveButtonEnabled()).toBe(false);
            });

            it('is disabled when form dirty & valid, formGenerator invalid', () => {
                const formGenerator = getFormGenerator(fixture);

                instance.form.patchValue(
                    {
                        userName: 'some_user'
                    },
                    { emitEvent: true }
                );
                instance.form.markAsDirty();
                formGenerator.isDirty = true;
                formGenerator.isValid = false;

                expect(instance.isSaveButtonEnabled()).toBe(false);
            });
        });
    });
});

function getFormGenerator(fixture: ComponentFixture<TestHostComponent>): MockFormGeneratorComponent {
    const formGenerator = fixture.debugElement.query(By.css('mesh-form-generator'));
    return formGenerator && formGenerator.componentInstance;
}

function setStateForUserWithNodeReference(activatedRoute: MockActivatedRoute, state: TestApplicationState): void {
    const USER_NODE_UUID = 'user_node_uuid';
    const USER_NODE_SCHEMA_UUID = 'user_node_schema_uuid';
    activatedRoute.setData('user', {
        uuid: 'user_uuid',
        nodeReference: {
            uuid: USER_NODE_UUID,
            schema: {
                uuid: USER_NODE_SCHEMA_UUID
            }
        },
        permissions: { update: true }
    });
    state.mockState({
        entities: {
            node: {
                [USER_NODE_UUID]: mockMeshNode({ uuid: USER_NODE_UUID })
            },
            schema: {
                [USER_NODE_SCHEMA_UUID]: mockSchema({ uuid: USER_NODE_SCHEMA_UUID })
            }
        }
    });
}

class MockAdminUserEffectsService {}

@Component({
    selector: 'mesh-test-host',
    template: `<mesh-user-detail></mesh-user-detail>`
})
class TestHostComponent {}
