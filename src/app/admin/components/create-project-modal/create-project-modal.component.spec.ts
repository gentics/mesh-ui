import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenticsUICoreModule, Notification, OverlayHostService } from 'gentics-ui-core';

import { CreateProjectModalComponent } from './create-project-modal.component';
import { TestApplicationState } from '../../../state/testing/test-application-state.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { componentTest } from '../../../../testing/component-test';
import { configureComponentTest } from '../../../../testing/configure-component-test';
import { SchemaEffectsService } from '../../../core/providers/effects/schema-effects.service';

describe('CreateProjectModal', () => {

    let appState: TestApplicationState;

    beforeEach(() => {
        configureComponentTest({
            imports: [GenticsUICoreModule, FormsModule, ReactiveFormsModule, SharedModule],
            providers: [
                { provide: ApplicationStateService, useClass: TestApplicationState },
                { provide: SchemaEffectsService, useValue: jasmine.createSpyObj('schemaEffects', ['loadSchemas']) },
                Notification,
                OverlayHostService
            ],
            declarations: [CreateProjectModalComponent]
        });
    });

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
                        project: {
                            uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                            name: 'demo',
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
                        project: {
                            uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                            name: 'demo',
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
                },
                user: {
                    'd8b043e818144e27b043e81814ae2713': {
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

    it(`shows a warning if the schema is not a container`,
        componentTest(() => CreateProjectModalComponent, fixture => {
            fixture.componentInstance.schema.setValue(appState.now.entities.schema['832235ac0570435ea235ac0570b35e10']);
            fixture.detectChanges();

            let warning = fixture.nativeElement.querySelector('.non-container-warning');
            expect(warning).toBeDefined();
        })
    );

    // TODO: gtx-select does not seem to work with async pipe
    xit(`shows changes in the schema entities`,
        componentTest(() => CreateProjectModalComponent, fixture => {
            fixture.detectChanges();
            tick();
            expect(getSelectOptions(fixture).length).toBe(6, fixture.nativeElement.innerHTML);
            appState.mockState({
                entities: {
                    schema: {}
                }
            });
            fixture.detectChanges();
            tick();
            expect(getSelectOptions(fixture).length).toBe(0);
        })
    );
});

function getSelectOptions(fixture: ComponentFixture<CreateProjectModalComponent>) {
    return fixture.nativeElement.querySelectorAll('li');
}


function triggerEvent(element: HTMLElement, eventName: string) {
    let event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
}
