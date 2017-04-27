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
                            permissions: [
                                'create',
                                'read',
                                'update',
                                'delete'
                            ]
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
                            permissions: [
                                'create',
                                'read',
                                'update',
                                'delete'
                            ]
                        }
                    }
                }
            }
        });
    }
}
