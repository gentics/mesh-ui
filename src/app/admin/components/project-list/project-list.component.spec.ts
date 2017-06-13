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
import { ProjectResponse } from '../../../common/models/server-models';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectEffectsService } from '../../../core/providers/effects/project-effects.service';
import { CoreModule } from '../../../core/core.module';

describe('ProjectListComponent', () => {

    let appState: TestApplicationState;
    const mockModal = { fromComponent() { } };

    beforeEach(async(() => {
        spyOn(mockModal, 'fromComponent').and.returnValue(Promise.resolve({ open() { } }));

        TestBed.configureTestingModule({
            declarations: [ProjectListComponent, MockProjectItemComponent],
            imports: [GenticsUICoreModule, FormsModule, SharedModule, CoreModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: ModalService, useValue: mockModal },
                { provide: ProjectEffectsService, useValue: jasmine.createSpyObj('stub', ['loadProjects'])}
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
                },
                user: {
                    d8b043e818144e27b043e81814ae2713: {
                        uuid: 'd8b043e818144e27b043e81814ae2713',
                        creator: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        created: '2017-05-02T09:06:00Z',
                        editor: {
                            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
                        },
                        edited: '2017-05-02T09:06:00Z',
                        lastname: 'Maulwurf',
                        firstname: 'Hans',
                        username: 'HM',
                        enabled: true,
                        groups: [{
                            name: 'Client Group',
                            uuid: '7e0a45aa7cbe471d8a45aa7cbe071d94'
                        }],
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
                schema: {
                    '5953336e4342498593336e4342398599': {
                        uuid: '5953336e4342498593336e4342398599',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:23Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:23Z',
                        displayField: 'title',
                        segmentField: 'filename',
                        container: false,
                        version: 1,
                        name: 'content',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'filename',
                            label: 'Filename',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'title',
                            label: 'Title',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'content',
                            label: 'Content',
                            required: false,
                            type: 'html'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, 'b73bbc9adae94c88bbbc9adae99c88f5': {
                        uuid: 'b73bbc9adae94c88bbbc9adae99c88f5',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:23Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:23Z',
                        displayField: 'name',
                        segmentField: 'name',
                        container: true,
                        version: 1,
                        name: 'folder',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: false,
                            type: 'string'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, 'eb967a50be7e4602967a50be7ed60265': {
                        uuid: 'eb967a50be7e4602967a50be7ed60265',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:23Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:23Z',
                        displayField: 'name',
                        segmentField: 'binary',
                        container: false,
                        version: 1,
                        name: 'binary_content',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'binary',
                            label: 'Binary Data',
                            required: false,
                            type: 'binary'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, 'a38a5c9af65844f28a5c9af65804f2e1': {
                        uuid: 'a38a5c9af65844f28a5c9af65804f2e1',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:48Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:48Z',
                        displayField: 'name',
                        segmentField: 'name',
                        container: false,
                        version: 1,
                        name: 'vehicle',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'weight',
                            label: 'Weight',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'SKU',
                            label: 'Stock Keeping Unit',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'price',
                            label: 'Price',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'stocklevel',
                            label: 'Stock Level',
                            required: false,
                            type: 'number'
                        }, {
                            name: 'description',
                            label: 'Description',
                            required: false,
                            type: 'html'
                        }, {
                            name: 'vehicleImage',
                            label: 'Vehicle Image',
                            required: false,
                            type: 'node',
                            allow: ['vehicleImage']
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, '832235ac0570435ea235ac0570b35e10': {
                        uuid: '832235ac0570435ea235ac0570b35e10',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:15:56Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:15:56Z',
                        displayField: 'name',
                        segmentField: 'image',
                        container: false,
                        version: 1,
                        name: 'vehicleImage',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'altText',
                            label: 'Alternative Text',
                            required: false,
                            type: 'string'
                        }, {
                            name: 'image',
                            label: 'Image',
                            required: false,
                            type: 'binary'
                        }],
                        permissions: {
                            create: true,
                            read: true,
                            update: true,
                            delete: true,
                            publish: true,
                            readPublished: true
                        }
                    }, '4de05a1e64894a44a05a1e64897a445b': {
                        uuid: '4de05a1e64894a44a05a1e64897a445b',
                        creator: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        created: '2017-04-28T13:16:04Z',
                        editor: {
                            uuid: '8fbffd876e694439bffd876e697439a4'
                        },
                        edited: '2017-04-28T13:16:04Z',
                        displayField: 'name',
                        segmentField: 'name',
                        container: true,
                        version: 1,
                        name: 'category',
                        fields: [{
                            name: 'name',
                            label: 'Name',
                            required: true,
                            type: 'string'
                        }, {
                            name: 'description',
                            label: 'Description',
                            required: false,
                            type: 'string'
                        }],
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
                        test3: testProject('test3')
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

function testProject(name: string): ProjectResponse {
    return {
        uuid: name,
        creator: {
            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
        },
        created: '2016-09-14T12:48:11Z',
        editor: {
            uuid: 'fddebd539e6b4eb79ebd539e6b6eb74f'
        },
        edited: '2016-09-14T12:48:11Z',
        name,
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
    };
}

@Component({
    selector: 'project-list-item',
    template: `-`
})
class MockProjectItemComponent {
    @Input()
    public projectUuid: string;
}
