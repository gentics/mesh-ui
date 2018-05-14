import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { NodeResponse, TagFamilyResponse, TagResponse } from '../../common/models/server-models';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';
import { ListState } from '../models/list-state.model';
import { TagState } from '../models/tags-state.model';
import { mergeEntityState } from './entity-state-actions';
import { ConfigService } from '../../core/providers/config/config.service';

@Injectable()
@Immutable()
export class TagsStateActions extends StateActionBranch<AppState> {

    @CloneDepth(0) private entities: EntityState;
    @CloneDepth(1) private tags: TagState;

    constructor() {
        super({
            uses: ['entities', 'tags'],
            initialState: {
                tags: {
                    tagFamilies: [],
                    tags: [],
                    loadCount: 0,
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

    fetchTagFamiliesSuccess(fetchedFamilies: TagFamilyResponse[]) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tagFamily: [
                ...fetchedFamilies
            ]
        }, false);
        this.tags.tagFamilies = [
            ...this.tags.tagFamilies,
            ...fetchedFamilies.filter(fetchedFamily => !this.tags.tagFamilies
                                .some(existingFamilyUuid => existingFamilyUuid === fetchedFamily.uuid))
                .map(family => family.uuid)
            ];
    }

    fetchTagsOfTagFamilySuccess(fetchedTags: TagResponse[]) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tag: [
                ...fetchedTags
            ]
        }, false);

        this.tags.tags = [
            ...this.tags.tags,
            ...fetchedTags.filter(fetchedTag => !this.tags.tags
                                .some(existingTagUuid => existingTagUuid === fetchedTag.uuid))
                .map(family => family.uuid)
        ];
    }

    createTagStart() {
        this.tags.loadCount++;
    }

    createTagSuccess(tag: TagResponse) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tag: [tag]
        }, false);
        this.tags.tags = [...this.tags.tags, tag.uuid];
    }

    createTagError() {
        this.tags.loadCount--;
    }

    updateTagStart() {
        this.tags.loadCount++;
    }

    updateTagSuccess(tag: TagResponse) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tag: [tag]
        }, false);
    }

    updateTagError(): void {
        this.tags.loadCount--;
    }

    deleteTagStart(): void {
        this.tags.loadCount++;
    }

    deleteTagSuccess(tagUuid: string) {
        this.tags.loadCount--;
        this.tags.tags = this.tags.tags.filter(uuid => uuid !== tagUuid);
    }

    deleteTagError(): void {
        this.tags.loadCount--;
    }

    createTagFamilyStart() {
        this.tags.loadCount++;
    }

    createTagFamilySuccess(tagFamily: TagFamilyResponse) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tagFamily: [tagFamily]
        }, false);
        this.tags.tagFamilies = [...this.tags.tagFamilies, tagFamily.uuid];
    }

    createTagFamilyError() {
        this.tags.loadCount--;
    }

    updateTagFamilyStart() {
        this.tags.loadCount++;
    }

    updateTagFamilySuccess(tagFamily: TagFamilyResponse) {
        this.tags.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            tagFamily: [tagFamily]
        }, false);
    }

    updateTagFamilyError() {
        this.tags.loadCount--;
    }

    deleteTagFamilyStart(): void {
        this.tags.loadCount++;
    }

    deleteTagFamilySuccess(tagFamilyUuid: string) {
        this.tags.loadCount--;
        this.tags.tagFamilies = this.tags.tagFamilies.filter(uuid => uuid !== tagFamilyUuid);
    }

    deleteTagFamilyError(): void {
        this.tags.loadCount--;
    }
}
