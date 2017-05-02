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
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
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
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }
                },
                node: {
                    '6adfe63bb9a34b8d9fe63bb9a30b8d8b': {
                        uuid: '6adfe63bb9a34b8d9fe63bb9a30b8d8b',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-04-27T09:08:13Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-04-27T09:08:20Z',
                        language: 'en',
                        availableLanguages: ['en'],
                        parentNode: {
                            projectName: 'demo',
                            uuid: '5b1d4f44d5a545f49d4f44d5a5c5f495',
                            displayName: 'folder2',
                            schema: {
                                name: 'folder',
                                uuid: 'a2356ca67bb742adb56ca67bb7d2adca'
                            }
                        },
                        tags: [],
                        childrenInfo: {},
                        schema: {
                            name: 'content',
                            uuid: 'f3a223a908474a29a223a908470a2961',
                            version: 1
                        },
                        displayField: 'title',
                        fields: {
                            name: 'stuff',
                            title: 'titel'
                        },
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
                        }],
                        version: {
                            uuid: '985e32ab5fb4461e9e32ab5fb4e61e95',
                            number: '0.2'
                        },
                        container: false,
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    },
                    'fdc937c9ce0440188937c9ce04b0185f': {
                        uuid: 'fdc937c9ce0440188937c9ce04b0185f',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2016-09-14T12:48:14Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2016-09-14T12:48:14Z',
                        language: 'en',
                        availableLanguages: ['en'],
                        parentNode: {
                            projectName: 'demo',
                            uuid: 'f69a7a7c1459495c9a7a7c1459e95c21',
                            displayName: 'Automobiles',
                            schema: {
                                name: 'category',
                                uuid: '084396b200bc46d18396b200bca6d11f'
                            }
                        },
                        tags: [{
                            name: 'Gasoline',
                            uuid: '4618c692de20456198c692de20956110',
                            tagFamily: 'Fuels'
                        }, {
                            name: 'Silver',
                            uuid: 'bb98bab72af544ec98bab72af594ec8d',
                            tagFamily: 'Colors'
                        }],
                        childrenInfo: {},
                        schema: {
                            name: 'vehicle',
                            uuid: '37b70224f243418bb70224f243d18b5c',
                            version: 1
                        },
                        displayField: 'name',
                        fields: {
                            name: 'Koenigsegg CXX',
                            weight: 1456,
                            SKU: 3,
                            price: 135000,
                            stocklevel: 4,
                            description: 'The Koenigsegg CCX is a mid-engined sports car built by Koenigsegg Automotive AB.',
                            vehicleImage: {
                                uuid: '46c8c31846d049e288c31846d0a9e2c4'
                            }
                        },
                        breadcrumb: [{
                            projectName: 'demo',
                            uuid: 'f69a7a7c1459495c9a7a7c1459e95c21',
                            displayName: 'Automobiles',
                            schema: {
                                name: 'category',
                                uuid: '084396b200bc46d18396b200bca6d11f'
                            }
                        }],
                        version: {
                            uuid: '532761d08a5b4867a761d08a5b3867d9',
                            number: '0.1'
                        },
                        container: false,
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
