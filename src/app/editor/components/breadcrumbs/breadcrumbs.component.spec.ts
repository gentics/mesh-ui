import { Component, Injectable, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';

import { componentTest } from '../../../../testing/component-test';
import { mockMeshNode, mockProject } from '../../../../testing/mock-models';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MockNavigationService } from '../../../core/providers/navigation/navigation.service.mock';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';

import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent:', () => {
    let appState: TestApplicationState;
    let navigation: MockNavigationService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                BreadcrumbsComponent,
                MockProjectSwitcherComponent,
                MockGtxBreadcrumbsComponent
            ],
            imports: [TestStateModule],
            providers: [{ provide: NavigationService, useClass: MockNavigationService }]
        });
    }));

    beforeEach(() => {
        navigation = TestBed.get(NavigationService);

        appState = TestBed.get(ApplicationStateService);
        appState.trackAllActionCalls({ behavior: 'original' });
        appState.mockState({
            list: {
                currentProject: 'testProject',
                currentNode: '6adfe63bb9a34b8d9fe63bb9a30b8d8b'
            },
            ui: {
                currentLanguage: 'en'
            },
            entities: {
                project: {
                    '55f6a4666eb8467ab6a4666eb8867a84': mockProject({
                        uuid: '55f6a4666eb8467ab6a4666eb8867a84',
                        name: 'testProject',
                        rootNode: {
                            projectName: 'testProject',
                            uuid: 'root_node_uuid',
                            schema: {
                                name: 'folder',
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                                version: '1.0'
                            }
                        }
                    })
                },
                node: {
                    root_node_uuid: mockMeshNode({
                        uuid: 'root_node_uuid',
                        container: true,
                        displayField: 'name',
                        fields: { name: 'rootNode' } as any,
                        breadcrumb: [
                            {
                                projectName: 'testProject',
                                uuid: 'root_node_uuid',
                                displayName: 'rootNode',
                                schema: {
                                    name: 'folder',
                                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca',
                                    version: '1.0'
                                }
                            }
                        ]
                    }),
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': mockMeshNode({
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        displayField: 'name',
                        fields: { name: 'current' } as any,
                        breadcrumb: [
                            {
                                projectName: 'testProject',
                                uuid: 'root_node_uuid',
                                displayName: 'rootNode',
                                schema: {
                                    name: 'folder',
                                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca',
                                    version: '1.0'
                                }
                            },
                            {
                                projectName: 'testProject',
                                uuid: '74abb50f8b5d4e1fabb50f8b5dee1f5c',
                                displayName: 'test',
                                schema: {
                                    name: 'folder',
                                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca',
                                    version: '1.0'
                                }
                            },
                            {
                                projectName: 'testProject',
                                uuid: '5b1d4f44d5a545f49d4f44d5a5c5f495',
                                displayName: 'folder2',
                                schema: {
                                    name: 'folder',
                                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca',
                                    version: '1.0'
                                }
                            },
                            {
                                projectName: 'testProject',
                                uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                                displayName: 'current',
                                schema: {
                                    name: 'folder',
                                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca',
                                    version: '1.0'
                                }
                            }
                        ]
                    }),
                    fdc937c9ce0440188937c9ce04b0185f: mockMeshNode({
                        uuid: 'fdc937c9ce0440188937c9ce04b0185f',
                        displayField: 'name',
                        fields: { name: 'current2' } as any,
                        breadcrumb: [
                            {
                                projectName: 'testProject',
                                uuid: 'root_node_uuid',
                                displayName: 'rootNode',
                                schema: {
                                    name: 'folder',
                                    uuid: 'a2356ca67bb742adb56ca67bb7d2adca',
                                    version: '1.0'
                                }
                            },
                            {
                                projectName: 'testProject',
                                uuid: 'f69a7a7c1459495c9a7a7c1459e95c21',
                                displayName: 'Automobiles',
                                schema: {
                                    name: 'category',
                                    uuid: '084396b200bc46d18396b200bca6d11f',
                                    version: '1.0'
                                }
                            },
                            {
                                projectName: 'testProject',
                                uuid: 'fdc937c9ce0440188937c9ce04b0185f',
                                displayName: 'current2',
                                schema: {
                                    name: 'category',
                                    uuid: '084396b200bc46d18396b200bca6d11f',
                                    version: '1.0'
                                }
                            }
                        ]
                    })
                }
            }
        });
    });

    it(
        `is empty when no currentProject is set`,
        componentTest(
            () => TestComponent,
            fixture => {
                appState.mockState({
                    list: {}
                });
                fixture.detectChanges();
                expect(getBreadcrumbText(fixture)).toEqual([]);
            }
        )
    );

    it(
        `contains only the root node when no node is open`,
        componentTest(
            () => TestComponent,
            fixture => {
                appState.mockState({
                    list: {
                        currentNode: undefined,
                        currentProject: 'testProject'
                    }
                });
                fixture.detectChanges();
                expect(getBreadcrumbText(fixture)).toEqual(['testProject']);
            }
        )
    );

    it(
        `does not duplicate root node when root node is open`,
        componentTest(
            () => TestComponent,
            fixture => {
                appState.mockState({
                    list: {
                        currentNode: 'root_node_uuid',
                        currentProject: 'testProject'
                    }
                });
                fixture.detectChanges();
                expect(getBreadcrumbText(fixture)).toEqual(['testProject']);
            }
        )
    );

    it(
        `shows the currently open node`,
        componentTest(
            () => TestComponent,
            fixture => {
                fixture.detectChanges();
                expect(getBreadcrumbText(fixture)).toEqual(['testProject', 'test', 'folder2', 'current']);
            }
        )
    );

    it(
        `changes the text when another node is opened`,
        componentTest(
            () => TestComponent,
            fixture => {
                fixture.detectChanges();
                appState.mockState({
                    list: {
                        currentProject: 'testProject',
                        currentNode: 'fdc937c9ce0440188937c9ce04b0185f'
                    }
                });
                fixture.detectChanges();
                expect(getBreadcrumbText(fixture)).toEqual(['testProject', 'Automobiles', 'current2']);
            }
        )
    );
});

function getBreadcrumbText(fixture: ComponentFixture<TestComponent>): string[] {
    const gtxBreadcrumbs: MockGtxBreadcrumbsComponent = fixture.debugElement.query(
        By.directive(MockGtxBreadcrumbsComponent)
    ).componentInstance;
    return gtxBreadcrumbs.routerLinks.map(it => it.text);
}

@Component({
    template: `<mesh-breadcrumbs></mesh-breadcrumbs>`
})
class TestComponent {}

@Component({
    selector: 'mesh-project-switcher',
    template: `-`
})
class MockProjectSwitcherComponent {}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'gtx-breadcrumbs',
    template: `-`
})
class MockGtxBreadcrumbsComponent {
    @Input() public routerLinks: IBreadcrumbRouterLink[];
}
