import { Component, QueryList, Injectable, Input } from '@angular/core';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { SharedModule } from '../../../shared/shared.module';
import { StateModule } from '../../../state/state.module';
import { GenticsUICoreModule, IBreadcrumbRouterLink } from 'gentics-ui-core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { EditorModule } from '../../editor.module';
import { NavigationService } from '../../../shared/providers/navigation/navigation.service';
import { Router } from '@angular/router';
import { Breadcrumb } from '../../../common/models/node.model';

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
            editor: {
                openNode: {
                    uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
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
                    },
                    '1fdb2624b6cb4b3a8ef7b5baabe47c74': {
                        uuid: '1fdb2624b6cb4b3a8ef7b5baabe47c74',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-04-20T12:00:42Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-04-20T12:00:42Z',
                        name: 'test3',
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
                            delete: false,
                            publish: true,
                            readPublished: true
                        }
                    }
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
                editor: {
                    openNode: undefined
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
                editor: {
                    openNode: {
                        uuid: 'fdc937c9ce0440188937c9ce04b0185f',
                        language: 'en',
                        projectName: 'demo'
                    }
                }
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['Automobiles']);
        })
    );
});

function getBreadcrumbText(fixture: ComponentFixture<TestComponent>): string[] {
    let gtxBreadcrumbs: MockGtxBreadcrumbsComponent = fixture.debugElement.query(By.directive(MockGtxBreadcrumbsComponent)).componentInstance;
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
