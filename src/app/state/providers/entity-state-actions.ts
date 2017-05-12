import { Injectable } from '@angular/core';
import { Immutable, StateActionBranch } from 'immutablets';
import { EntityState } from '../models/entity-state.model';
import { AppState } from '../models/app-state.model';

@Injectable()
@Immutable()
export class EntityStateActions extends StateActionBranch<AppState> {
    private entities: EntityState;

    constructor() {
        super({
            uses: 'entities',
            initialState: {
                entities: {
                    project: {},
                    node: {
                        '4d1cabf1382e41ea9cabf1382ef1ea7c': {
                            uuid: '4d1cabf1382e41ea9cabf1382ef1ea7c',
                            creator: {
                                uuid: '8fbffd876e694439bffd876e697439a4'
                            },
                            created: '2017-04-28T13:16:14Z',
                            editor: {
                                uuid: '8fbffd876e694439bffd876e697439a4'
                            },
                            edited: '2017-04-28T13:16:25Z',
                            language: 'en',
                            availableLanguages: ['en'],
                            parentNode: {
                                projectName: 'demo',
                                uuid: '6fc30221c18549fa830221c18589fa74',
                                displayName: 'Vehicle Images',
                                schema: {
                                    name: 'folder',
                                    uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                                }
                            },
                            project: {
                                uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                                name: 'demo',
                            },
                            tags: [],
                            childrenInfo: {},
                            schema: {
                                name: 'vehicleImage',
                                uuid: '832235ac0570435ea235ac0570b35e10',
                                version: 1
                            },
                            displayField: 'name',
                            fields: {
                                name: 'Indian Empress Image',
                                image: {
                                    'fileName': 'yacht-indian-empress.jpg',
                                    'width': 1024,
                                    'height': 508,
                                    'sha512sum': '45d976266c7e702ad96b9e0c44f504b9957619dbc5436b9937f919a5b3' +
                                    'c01b004e0a99e39d832b969a91d3bd2dda3e411c0374297fe3b3e8405f0fa468629e8b',
                                    'fileSize': 149527,
                                    'mimeType': 'aksljd',
                                    'dominantColor': '#6683af'
                                }
                            },
                            breadcrumb: [{
                                projectName: 'demo',
                                uuid: '6fc30221c18549fa830221c18589fa74',
                                displayName: 'Vehicle Images',
                                schema: {
                                    name: 'folder',
                                    uuid: 'b73bbc9adae94c88bbbc9adae99c88f5'
                                }
                            }],
                            version: {
                                uuid: 'f5f2ab25378d455ab2ab25378d755a53',
                                number: '1.0'
                            },
                            container: false,
                            permissions: {
                                create: false,
                                read: true,
                                update: false,
                                delete: false,
                                publish: false,
                                readPublished: false
                            }
                        },
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
                            project: {
                                uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                                name: 'demo',
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
                            project: {
                                uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
                                name: 'demo',
                            },
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
                    },
                    user: {},
                    schema: {}
                }
            }
        });
    }
}
