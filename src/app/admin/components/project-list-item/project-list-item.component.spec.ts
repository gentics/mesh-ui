import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { GenticsUICoreModule, ModalService, Notification } from 'gentics-ui-core';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProjectListItemComponent } from './project-list-item.component';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ProjectResponse } from '../../../common/models/server-models';
import { mockProject } from '../../../../testing/mock-models';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';

describe('ProjectListItemComponent', () => {

    let appState: TestApplicationState;
    let mockModal: any;
    let mockNotification: any;
    const mockAdminProjectEffectsService = jasmine.createSpyObj('ProjectEffectsService', ['deleteProject']);

    beforeEach(() => {
        mockModal = { dialog() { } };
        spyOn(mockModal, 'dialog').and.returnValue(Promise.resolve({ open() { } }));

        mockNotification = { show() { } };
        spyOn(mockNotification, 'show');

        configureComponentTest({
            imports: [GenticsUICoreModule, FormsModule, SharedModule, TestStateModule],
            providers: [
                { provide: ModalService, useValue: mockModal },
                { provide: Notification, useValue: mockNotification },
                { provide: I18nService, useValue: { translate() { } } },
                { provide: AdminProjectEffectsService, useValue: mockAdminProjectEffectsService}
            ],
            declarations: [TestComponent, ProjectListItemComponent]
        });
    });

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            auth: {
                currentUser: 'd8b043e818144e27b043e81814ae2713'
            },
            entities: {
                project: {
                    '55f6a4666eb8467ab6a4666eb8867a84': mockProject({
                        uuid: '55f6a4666eb8467ab6a4666eb8867a84',
                        name: 'demo',
                        permissions: {
                            create: true,
                            read: true,
                            update: false,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }),
                    'b5eba09ef1554337aba09ef155d337a5': mockProject({
                        uuid: 'b5eba09ef1554337aba09ef155d337a5',
                        name: 'tvc',
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }),
                    '1fdb2624b6cb4b3a8ef7b5baabe47c74': mockProject({
                        uuid: '1fdb2624b6cb4b3a8ef7b5baabe47c74',
                        name: 'test3',
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: false,
                            publish: true,
                            readPublished: true
                        }
                    })
                }
            }
        });
    });

    it(`shows the project name and icons`,
        componentTest(() => TestComponent, fixture => {
            fixture.componentInstance.project = appState.now.entities.project['b5eba09ef1554337aba09ef155d337a5'];
            fixture.detectChanges();
            tick();
            expect(projectName(fixture)).toBe('tvc');
            expect(getButton(fixture, 'edit')).toBeDefined();
            expect(getButton(fixture, 'delete')).toBeDefined();
        })
    );

    it(`does not show edit button if update permission is missing`,
        componentTest(() => TestComponent, fixture => {
            fixture.componentInstance.project = appState.now.entities.project['55f6a4666eb8467ab6a4666eb8867a84'];
            fixture.detectChanges();
            expect(getButton(fixture, 'edit')).toBeUndefined();
        })
    );

    it(`does not show delete button if delete permission is missing`,
        componentTest(() => TestComponent, fixture => {
            fixture.componentInstance.project = appState.now.entities.project['1fdb2624b6cb4b3a8ef7b5baabe47c74'];
            fixture.detectChanges();
            expect(getButton(fixture, 'delete')).toBeUndefined();
        })
    );

    it(`opens confirmation dialog when delete button is clicked`,
        componentTest(() => TestComponent, fixture => {
            fixture.componentInstance.project = appState.now.entities.project['b5eba09ef1554337aba09ef155d337a5'];
            fixture.detectChanges();
            getButton(fixture, 'delete').click();
            fixture.detectChanges();
            expect(mockModal.dialog).toHaveBeenCalled();
            tick();
            expect(mockAdminProjectEffectsService.deleteProject).toHaveBeenCalled();
        })
    );

    it(`updates the state on blur`,
        componentTest(() => TestComponent, fixture => {
            fixture.componentInstance.project = appState.now.entities.project['b5eba09ef1554337aba09ef155d337a5'];
            fixture.detectChanges();

            const input: HTMLInputElement = fixture.nativeElement.querySelector('gtx-input input');
            input.value = 'abcdef';
            triggerEvent(input, 'input');
            fixture.detectChanges();
            triggerEvent(input, 'blur');
            fixture.detectChanges();
            // TODO maybe remove this if state and api is implemented and notification is not done in this component
            tick();
            expect(mockNotification.show).toHaveBeenCalled();
        })
    );

    it(`must not update the state on blur if no changes are made`,
        componentTest(() => TestComponent, fixture => {
            fixture.componentInstance.project = appState.now.entities.project['b5eba09ef1554337aba09ef155d337a5'];
            fixture.detectChanges();

            const input: HTMLInputElement = fixture.nativeElement.querySelector('gtx-input input');
            triggerEvent(input, 'blur');
            fixture.detectChanges();
            // TODO maybe remove this if state and api is implemented and notification is not done in this component
            tick();
            expect(mockNotification.show).not.toHaveBeenCalled();
        })
    );
});

function triggerEvent(element: HTMLElement, eventName: string) {
    const event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
}

function projectName(fixture: ComponentFixture<TestComponent>): string {
    const input = fixture.nativeElement.querySelector('input');
    const element: HTMLElement = fixture.nativeElement.querySelector('div.item-primary');

    if (input) {
        return input.value;
    } else {
        return element.textContent!;
    }
}

function getButton(fixture: ComponentFixture<TestComponent>, iconName: string): HTMLElement {
    const element: HTMLElement = fixture.nativeElement;
    return Array.from(element.querySelectorAll('gtx-button'))
        .filter(it => it.textContent === iconName)[0] as HTMLElement;
}

@Component({
    template: `<mesh-project-list-item [projectUuid]="project.uuid"></mesh-project-list-item>`
})
class TestComponent {
    project: ProjectResponse;
}
