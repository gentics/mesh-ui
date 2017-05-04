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
                            rootNodeUuid: '8a74925be3b24272b4925be3b2f27289',
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
                    }
                }
            }
        });
    }
}
