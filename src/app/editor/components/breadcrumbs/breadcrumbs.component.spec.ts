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
                currentProject: 'testProject',
                currentNode:  '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
            },
            ui: {
                currentLanguage: 'en',
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
                                uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                            }
                        }
                    })
                },
                node: {
                    'root_node_uuid': mockMeshNode({
                        uuid: 'root_node_uuid',
                        container: true,
                        displayField: 'name',
                        fields: { name: 'rootNode' } as any,
                        breadcrumb: []
                    }),
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': mockMeshNode({
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        displayField: 'name',
                        fields: { name: 'current' } as any,
                        breadcrumb: [{
                            projectName: 'testProject',
                            uuid: '5b1d4f44d5a545f49d4f44d5a5c5f495',
                            displayName: 'folder2',
                            schema: {
                                name: 'folder',
                                uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                            }
                        }, {
                            projectName: 'testProject',
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
                        displayField: 'name',
                        fields: { name: 'current2' } as any,
                        breadcrumb: [{
                            projectName: 'testProject',
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

    it(`is empty when no currentProject is set`,
        componentTest(() => TestComponent, fixture => {
            appState.mockState({
                list: {}
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual([]);
        })
    );

    it(`contains only the root node when no node is open`,
        componentTest(() => TestComponent, fixture => {
            appState.mockState({
                list: {
                    currentNode: undefined,
                    currentProject: 'testProject'
                }
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['testProject']);
        })
    );

    it(`does not duplicate root node when root node is open`,
        componentTest(() => TestComponent, fixture => {
            appState.mockState({
                list: {
                    currentNode: 'root_node_uuid',
                    currentProject: 'testProject'
                }
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['testProject']);
        })
    );

    it(`shows the currently open node`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['testProject', 'test', 'folder2', 'current']);
        })
    );

    it(`changes the text when another node is opened`,
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            appState.mockState({
                list: {
                    currentProject: 'testProject',
                    currentNode: 'fdc937c9ce0440188937c9ce04b0185f'
                }
            });
            fixture.detectChanges();
            expect(getBreadcrumbText(fixture)).toEqual(['testProject', 'Automobiles', 'current2']);
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
