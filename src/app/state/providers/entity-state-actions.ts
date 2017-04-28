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
                                update: true,
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
                        }
                    }
                }
            }
        });
    }
}
