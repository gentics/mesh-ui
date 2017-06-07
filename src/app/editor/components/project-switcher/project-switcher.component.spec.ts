import { Component, Injectable } from '@angular/core';
import { TestBed, tick } from '@angular/core/testing';
import { GenticsUICoreModule, OverlayHostService } from 'gentics-ui-core';

import { StateModule } from '../../../state/state.module';
import { componentTest } from '../../../../testing/component-test';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ProjectSwitcherComponent } from './project-switcher.component';
import { SharedModule } from '../../../shared/shared.module';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { ProjectEffectsService } from '../../../core/providers/effects/project-effects.service';


describe('ProjectSwitcherComponent:', () => {

    let appState: TestApplicationState;
    let navigation: MockNavigationService;

    beforeEach(() => {
        configureComponentTest({
            declarations: [TestComponent, ProjectSwitcherComponent],
            imports: [SharedModule, StateModule, GenticsUICoreModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: NavigationService, useClass: MockNavigationService },
                { provide: ProjectEffectsService, useValue: jasmine.createSpyObj('ProjectEffectsService', ['loadProjects']) },
                OverlayHostService
            ]
        });
    });

    beforeEach(() => {
        navigation = TestBed.get(NavigationService);
        spyOn(navigation, 'list').and.callThrough();

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
                currentLanguage: 'en',
            },
            entities: {
                project: {
                    '55f6a4666eb8467ab6a4666eb8867a84': {
                        uuid: '55f6a4666eb8467ab6a4666eb8867a84',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2016-09-14T12:48:11Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2016-09-14T12:48:11Z',
                        name: 'demo',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                        permissions: {
                            create: true,
                            read: true,
                            update: false,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    },
                    'b5eba09ef1554337aba09ef155d337a5': {
                        uuid: 'b5eba09ef1554337aba09ef155d337a5',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-04-20T12:00:42Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-04-20T12:00:42Z',
                        name: 'tvc',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        },
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }
                }
            }
        });
    });

    it(`shows the currently selected project`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            const selectText: string = fixture.nativeElement.querySelector('.current-project').innerText;
            expect(selectText).toContain('demo', fixture.nativeElement.innerHTML);
        })
    );

    it(`shows the names of all available projects`,
        componentTest(() => TestComponent, fixture => {
            // Open Select
            fixture.nativeElement.querySelector('.current-project').click();
            fixture.detectChanges();
            tick();

            const projectNames: string[] = Array.from<HTMLLIElement>(fixture.nativeElement.querySelectorAll('gtx-dropdown-item'))
                .map(li => li.innerText);
            expect(projectNames).toEqual(['demo', 'tvc'], fixture.nativeElement.innerHTML);
        })
    );

    it(`navigates to the selected project`,
        componentTest(() => TestComponent, fixture => {
            // Open Select
            fixture.nativeElement.querySelector('.current-project').click();
            fixture.detectChanges();
            tick();

            const demoProject: HTMLLIElement = Array.from<HTMLLIElement>(fixture.nativeElement.querySelectorAll('gtx-dropdown-item'))
                .filter(li => li.innerText === 'demo')[0];

            demoProject.click();
            fixture.detectChanges();
            tick();

            // Demo Project
            expect(navigation.list).toHaveBeenCalledWith('demo', '83ff6b33bbda4048bf6b33bbdaa04840');
        })
    );

    it(`displays the current project when it changes`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();

            const selectText: string = fixture.nativeElement.querySelector('.current-project').innerText;
            expect(selectText).toContain('demo', fixture.nativeElement.innerHTML);

            appState.mockState({
                editor: {
                    openNode: {
                        projectName: 'tvc',
                        uuid: '6c71621d1a8542e4b1621d1a8542e46f',
                        language: 'en'
                    }
                }
            });

            fixture.detectChanges();

            const nextSelectText: string = fixture.nativeElement.querySelector('.current-project').innerText;
            expect(nextSelectText).toContain('tvc', fixture.nativeElement.innerHTML);
        })
    );
});

@Component({
    template: `
        <gtx-overlay-host></gtx-overlay-host>
        <project-switcher></project-switcher>`
})
class TestComponent { }

@Injectable()
class MockNavigationService {
    list(projectName: string, containerUuid: string) {
        return { navigate() { } };
    }
}
