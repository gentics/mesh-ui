import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Button, GenticsUICoreModule, ModalService } from 'gentics-ui-core';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ProjectListComponent } from './project-list.component';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { mockProject } from '../../../../testing/mock-models';
import { TestStateModule } from '../../../state/testing/test-state.module';

describe('ProjectListComponent', () => {

    let appState: TestApplicationState;
    const mockModal = { fromComponent() { } };

    beforeEach(async(() => {
        spyOn(mockModal, 'fromComponent').and.returnValue(Promise.resolve({ open() { } }));

        TestBed.configureTestingModule({
            declarations: [ProjectListComponent, MockProjectItemComponent],
            imports: [GenticsUICoreModule, FormsModule, SharedModule, CoreModule, TestStateModule],
            providers: [
                { provide: ModalService, useValue: mockModal },
                { provide: ListEffectsService, useValue: jasmine.createSpyObj('stub', ['loadProjects'])}
            ]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            auth: {
                currentUser: 'd8b043e818144e27b043e81814ae2713'
            }, entities: {
                project: {
                    '55f6a4666eb8467ab6a4666eb8867a84': mockProject({
                        uuid: '55f6a4666eb8467ab6a4666eb8867a84',
                        name: 'demo',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                    }),
                    'b5eba09ef1554337aba09ef155d337a5': mockProject({
                        uuid: 'b5eba09ef1554337aba09ef155d337a5',
                        name: 'tvc',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                    })
                }
            }
        });
    });

    it(`shows the list of projects`,
        componentTest(() => ProjectListComponent, fixture => {
            fixture.detectChanges();
            expect(getListedProjectUuids(fixture)).toEqual(['55f6a4666eb8467ab6a4666eb8867a84', 'b5eba09ef1554337aba09ef155d337a5']);
        })
    );

    it(`shows a new project after it was added`,
        componentTest(() => ProjectListComponent, fixture => {
            fixture.detectChanges();
            appState.mockState({
                entities: {
                    project: {
                        ...appState.now.entities.project,
                        test3: mockProject({ name: 'test3', uuid: 'test3' })
                    }
                }
            });
            fixture.detectChanges();
            expect(getListedProjectUuids(fixture)).toEqual(['55f6a4666eb8467ab6a4666eb8867a84', 'b5eba09ef1554337aba09ef155d337a5', 'test3']);
        })
    );

    it(`opens create project dialog when create button is clicked`,
        componentTest(() => ProjectListComponent, fixture => {
            fixture.debugElement.query(By.directive(Button)).nativeElement.click();
            fixture.detectChanges();
            expect(mockModal.fromComponent).toHaveBeenCalledWith(CreateProjectModalComponent);
        })
    );
});

function getListedProjectUuids(fixture: ComponentFixture<ProjectListComponent>): string[] {
    return fixture.debugElement.queryAll(By.directive(MockProjectItemComponent))
        .map(it => it.componentInstance.projectUuid);
}

@Component({
    selector: 'project-list-item',
    template: `-`
})
class MockProjectItemComponent {
    @Input()
    public projectUuid: string;
}
