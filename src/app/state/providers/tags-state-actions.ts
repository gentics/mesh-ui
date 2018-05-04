import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { NodeResponse, TagFamilyResponse, TagResponse } from '../../common/models/server-models';
import { ConfigService } from '../../core/providers/config/config.service';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { ListState } from '../models/list-state.model';
import { TagState } from '../models/tags-state.model';

import { mergeEntityState } from './entity-state-actions';

@Injectable()
@Immutable()
export class TagsStateActions extends StateActionBranch<AppState> {
    @CloneDepth(0)
    private entities: EntityState;
    @CloneDepth(1)
    private tags: TagState;

    constructor() {
        super({
            uses: ['entities', 'tags'],
            initialState: {
                tags: {
                    tagFamilies: [],
                    tags: [],
                    loadCount: 0
                }
            }
        });
    }

    actionStart() {
        this.tags.loadCount++;
    }

    actionSuccess() {
        this.tags.loadCount--;
    }

    actionError() {
        this.tags.loadCount--;
    }

    createTagFamilySuccess(tagFamily: TagFamilyResponse) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(
            this.entities,
            {
                tagFamily: [tagFamily]
            },
            false
        );
        this.tags.tagFamilies = [...this.tags.tagFamilies, tagFamily.uuid];
    }

    createTagSuccess(tag: TagResponse) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(
            this.entities,
            {
                tag: [tag]
            },
            false
        );
        this.tags.tags = [...this.tags.tags, tag.uuid];
    }

    fetchTagFamiliesSuccess(tagFamilies: TagFamilyResponse[]) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(
            this.entities,
            {
                tagFamily: [...tagFamilies]
            },
            false
        );
        this.tags.tagFamilies = [...this.tags.tagFamilies, ...tagFamilies.map(family => family.uuid)];
    }

    fetchTagsOfTagFamilySuccess(tags: TagResponse[]) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(
            this.entities,
            {
                tag: [...tags]
            },
            false
        );

        this.tags.tags = [...this.tags.tags, ...tags.map(tag => tag.uuid)];
    }
}
