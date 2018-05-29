import { Component, Injectable } from '@angular/core';
import { tick, TestBed } from '@angular/core/testing';
import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { mockProject } from '../../../../testing/mock-models';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';

import { ProjectSwitcherComponent } from './project-switcher.component';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';

describe('ProjectSwitcherComponent:', () => {
    let appState: TestApplicationState;
    let navigation: MockNavigationService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [TestComponent, ProjectSwitcherComponent],
            imports: [SharedModule, TestStateModule, GenticsUICoreModule],
            providers: [
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ListEffectsService, useValue: jasmine.createSpyObj('ListEffectsService', ['loadProjects']) },
                OverlayHostService
            ]
        });
    });

    beforeEach(() => {
        navigation = TestBed.get(NavigationService);

        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            editor: {
                openNode: {
                    uuid: '8a74925be3b24272b4925be3b2f27289',
                    projectName: 'demo',
                    language: 'en'
                }
            },
            ui: {
                currentLanguage: 'en'
            },
            entities: {
                project: {
                    '55f6a4666eb8467ab6a4666eb8867a84': mockProject({
                        uuid: '55f6a4666eb8467ab6a4666eb8867a84',
                        name: 'demo',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                                version: '1.0'
                            }
                        }
                    }),
                    b5eba09ef1554337aba09ef155d337a5: mockProject({
                        uuid: 'b5eba09ef1554337aba09ef155d337a5',
                        name: 'tvc',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                                version: '1.0'
                            }
                        }
                    })
                }
            }
        });
    });

    it(
        `shows the names of all available projects`,
        componentTest(
            () => TestComponent,
            fixture => {
                // Open Select
                fixture.nativeElement.querySelector('.current-project').click();
                fixture.detectChanges();
                tick();

                const projectNames: string[] = Array.from<HTMLLIElement>(
                    fixture.nativeElement.querySelectorAll('gtx-dropdown-item')
                ).map(li => li.innerText);
                expect(projectNames).toEqual(['demo', 'tvc']);
            }
        )
    );

    it(
        `navigates to the selected project`,
        componentTest(
            () => TestComponent,
            fixture => {
                // Open Select
                fixture.nativeElement.querySelector('.current-project').click();
                fixture.detectChanges();
                tick();

                const demoProject: HTMLLIElement = Array.from<HTMLLIElement>(
                    fixture.nativeElement.querySelectorAll('gtx-dropdown-item')
                ).filter(li => li.innerText === 'demo')[0];

                demoProject.click();
                fixture.detectChanges();
                tick();

                // Demo Project
                expect(navigation.list).toHaveBeenCalledWith('demo', '83ff6b33bbda4048bf6b33bbdaa04840');
            }
        )
    );
});

@Component({
    template: `
        <gtx-overlay-host></gtx-overlay-host>
        <mesh-project-switcher></mesh-project-switcher>`
})
class TestComponent {}
