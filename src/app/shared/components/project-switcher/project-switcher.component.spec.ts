import { Component, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownItem, GenticsUICoreModule } from 'gentics-ui-core';

import { StateModule } from '../../../state/state.module';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { SharedModule } from '../../shared.module';
import { componentTest } from '../../../../testing/component-test';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { UI_LANGUAGES } from '../../../common/config/config';


describe('ProjectSwitcherComponent:', () => {

    let appState: TestApplicationState;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [SharedModule, StateModule, GenticsUICoreModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState }
            ]
        });
    }));

    beforeEach(() => {
        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        // Initial language is english
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
                            firstName: '',
                            lastName: '',
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2016-09-14T12:48:11Z',
                        editor: {
                            firstName: '',
                            lastName: '',
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2016-09-14T12:48:11Z',
                        name: 'demo',
                        rootNodeUuid: '8a74925be3b24272b4925be3b2f27289',
                        permissions: [
                            'create',
                            'read',
                            'update',
                            'delete'
                        ]
                    },
                    'b5eba09ef1554337aba09ef155d337a5': {
                        uuid: 'b5eba09ef1554337aba09ef155d337a5',
                        creator: {
                            firstName: '',
                            lastName: '',
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-04-20T12:00:42Z',
                        editor: {
                            firstName: '',
                            lastName: '',
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-04-20T12:00:42Z',
                        name: 'tvc',
                        rootNodeUuid: '6c71621d1a8542e4b1621d1a8542e46f',
                        permissions: [
                            'create',
                            'read',
                            'update',
                            'delete'
                        ]
                    }
                }
            }
        });
    });

    it(`shows the currently selected project`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            const selectText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
            expect(selectText).toBe('demo', fixture.nativeElement.innerHTML);
        })
    );

    it(`shows the names of all available projects`,
        componentTest(() => TestComponent, fixture => {
            // Open Select
            fixture.nativeElement.querySelector('gtx-button').click();
            fixture.detectChanges();
            tick();

            const projectNames: string[] = Array.from<HTMLLIElement>(fixture.nativeElement.querySelectorAll('gtx-dropdown-item'))
                .map(li => li.innerText);
            expect(projectNames).toEqual(['demo', 'tvc'], fixture.nativeElement.innerHTML);
        })
    );

    it(`changes the state when selecting a project`,
        componentTest(() => TestComponent, fixture => {
            // Open Select
            fixture.nativeElement.querySelector('gtx-button').click();
            fixture.detectChanges();
            tick();

            const demoProject: HTMLLIElement = Array.from<HTMLLIElement>(fixture.nativeElement.querySelectorAll('gtx-dropdown-item'))
                .filter(li => li.innerText === 'demo')[0];

            demoProject.click();
            fixture.detectChanges();
            tick();

            // Demo Project
            expect(appState.actions.editor.openNode).toHaveBeenCalledWith('demo', '8a74925be3b24272b4925be3b2f27289', 'en');
        })
    );

    it(`displays the current project when it changes`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();

            const selectText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
            expect(selectText).toBe('demo', fixture.nativeElement.innerHTML);

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

            const nextSelectText: string = fixture.nativeElement.querySelector('gtx-button').innerText;
            expect(nextSelectText).toBe('tvc', fixture.nativeElement.innerHTML);
        })
    );
});

@Component({
    template: `
        <gtx-overlay-host></gtx-overlay-host>
        <project-switcher></project-switcher>`
})
class TestComponent {}
