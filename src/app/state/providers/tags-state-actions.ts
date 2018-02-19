import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { NodeResponse, TagFamilyResponse, TagResponse } from '../../common/models/server-models';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { ListState } from '../models/list-state.model';
import { mergeEntityState } from './entity-state-actions';
import { ConfigService } from '../../core/providers/config/config.service';

@Injectable()
@Immutable()
export class TagsStateActions extends StateActionBranch<AppState> {
    @CloneDepth(0) private entities: EntityState;
    //@CloneDepth(1) private list: ListState;
    //@CloneDepth(1) private admin: AdminState;

    private loadCount = 0;

    constructor(private config: ConfigService) {
        super({
            uses: 'entities',
            initialState: {
                entities: {
                    project: {},
                    node: {},
                    user: {},
                    schema: {},
                    microschema: {},
                    tagFamily: {},
                    tag: {},
                }
            }
        });
    }
    actionStart() {
        this.loadCount++;
    }

    actionSuccess() {
        this.loadCount--;
    }

    actionError() {
        this.loadCount--;
    }


    createTagFamilySuccess(tagFamily: TagFamilyResponse) {
        this.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tagFamily: [tagFamily]
        }, false);
    }

    createTagSuccess(tag: TagResponse) {
        this.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tag: [tag]
        }, false);
    }

    fetchTagFamiliesSuccess(tagFamilies: TagFamilyResponse[]) {
        this.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tagFamily: [
                ...tagFamilies
            ]
        }, false);
    }

    fetchTagsOfTagFamilySuccess(tags: TagResponse[]) {
        this.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tag: [
                ...tags
            ]
        }, false);
    }
}
