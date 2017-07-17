import { Component, Injectable, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { StateModule } from '../../../state/state.module';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { mockMeshNode, mockProject } from '../../../../testing/mock-models';

describe('BreadcrumbsComponent:', () => {

    let appState: TestApplicationState;
    let navigation: MockNavigationService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, BreadcrumbsComponent, MockProjectSwitcherComponent, MockGtxBreadcrumbsComponent],
            imports: [StateModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: NavigationService, useClass: MockNavigationService }
            ]
        });
    }));

    beforeEach(() => {
        navigation = TestBed.get(NavigationService);
        spyOn(navigation, 'list').and.callThrough();

        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            list: {
                currentProject: 'demo',
                currentNode:  '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
            },
            ui: {
                currentLanguage: 'en',
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
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }
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
                        }
                    }),
                    '1fdb2624b6cb4b3a8ef7b5baabe47c74': mockProject({
                        uuid: '1fdb2624b6cb4b3a8ef7b5baabe47c74',
                        name: 'test3',
                        rootNode: {
                            projectName: 'demo',
                            uuid: '83ff6b33bbda4048bf6b33bbdaa04840',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }
                    })
                },
                node: {
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': mockMeshNode({
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        breadcrumb: [{
                            projectName: 'demo',
                            uuid: '5b1d4f44d5a545f49d4f44d5a5c5f495',
                            displayName: 'folder2',
                            schema: {
                                name: 'folder',
                                uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                            }
                        }, {
                            projectName: 'demo',
                            uuid: '74abb50f8b5d4e1fabb50f8b5dee1f5c',
                            displayName: 'test',
                            schema: {
                                name: 'folder',
                                uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                            }
                        }]
                    }),
                    'fdc937c9ce0440188937c9ce04b0185f': mockMeshNode({
                        uuid: 'fdc937c9ce0440188937c9ce04b0185f',
                        breadcrumb: [{
                            projectName: 'demo',
                            uuid: 'f69a7a7c1459495c9a7a7c1459e95c21',
                            displayName: 'Automobiles',
                            schema: {
                                name: 'category',
                                uuid: '084396b200bc46d18396b200bca6d11f'
                            }
                        }]
                    })
                }
            }
        });
    });

    it(`shows the currently open node`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['folder2', 'test']);
        })
    );

    it(`empties the breadcrumb when no node is open`,
        componentTest(() => TestComponent, fixture => {
            appState.mockState({
                list: {
                    currentNode: undefined
                }
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture).length).toEqual(0);
        })
    );

    it(`changes the text when another node is opened`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            appState.mockState({
                list: {
                    currentProject: 'demo',
                    currentNode: 'fdc937c9ce0440188937c9ce04b0185f'
                }
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['Automobiles']);
        })
    );
});

function getBreadcrumbText(fixture: ComponentFixture<TestComponent>): string[] {
    const gtxBreadcrumbs: MockGtxBreadcrumbsComponent = fixture.debugElement.query(By.directive(MockGtxBreadcrumbsComponent)).componentInstance;
    return gtxBreadcrumbs.routerLinks.map(it => it.text);
}

@Component({
    template: `<breadcrumbs></breadcrumbs>`
})
class TestComponent { }

@Component({
    selector: 'project-switcher',
    template: `-`
})
class MockProjectSwitcherComponent { }

@Component({
    selector: 'gtx-breadcrumbs',
    template: `-`
})
class MockGtxBreadcrumbsComponent {
    @Input()
    public routerLinks: IBreadcrumbRouterLink[];
}

@Injectable()
class MockNavigationService {
    list(projectName: string, containerUuid: string) {
        return { commands: () => [] };
    }
}
