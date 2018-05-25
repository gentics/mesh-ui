import { Injectable } from '@angular/core';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';

import { TagFamilyResponse, TagResponse } from '../../../common/models/server-models';
import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';
import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Injectable()
export class TagsEffectsService {
    constructor(private api: ApiService,
                private notification: I18nNotification,
                private state: ApplicationStateService) {
    }

    loadTagFamiliesAndTheirTags(project: string): void {
        this.state.actions.tag.clearAll();
        this.state.actions.tag.actionStart();
        this.api.project.getTagFamilies({ project })
        .subscribe(tagFamiesResponse => {
            this.state.actions.tag.fetchTagFamiliesSuccess(tagFamiesResponse.data);
            tagFamiesResponse.data.forEach((tagFamily: TagFamily) => this.loadTagsOfTagFamily(project, tagFamily.uuid));
        }, error => {
            this.state.actions.tag.actionError();
            this.notification.show({
                type: 'error',
                message: 'editor.load_tag_families_error'
            });
        });
    }

    loadTagsOfTagFamily(project: string, tagFamilyUuid: string): void {
        this.state.actions.tag.actionStart();
        this.api.project.getTagsOfTagFamily({project, tagFamilyUuid})
        .subscribe(response => {
            this.state.actions.tag.fetchTagsOfTagFamilySuccess(response.data);
        }, error => {
            this.state.actions.tag.actionError();
            this.notification.show({
                type: 'error',
                message: 'editor.load_tags_error'
            });
        });
    }

    createTag(project: string, tagFamilyUuid: string, name: string): Promise<TagResponse> {
        this.state.actions.tag.createTagStart();
        return this.api.project.createTag({project, tagFamilyUuid}, { name }).toPromise()
        .then(response => {
            this.state.actions.tag.createTagSuccess(response);
            return response;
        }, error => {
            this.state.actions.tag.createTagError();
            this.notification.show({
                type: 'error',
                message: 'project.create_tag_error'
            });
            throw error;
        });
    }

    updateTag(project: string, tagFamilyUuid: string, tagUuid: string, name: string): Promise<TagResponse> {
        this.state.actions.tag.updateTagStart();
        return this.api.project.updateTag({project, tagFamilyUuid, tagUuid}, { name }).toPromise()
        .then(response => {
            this.state.actions.tag.updateTagSuccess(response);
            return response;
        }, error => {
            this.state.actions.tag.updateTagError();
            this.notification.show({
                type: 'error',
                message: 'project.update_tag_error'
            });
            throw error;
        });
    }

    deleteTag(project: string, tag: Tag): Promise<null> {
        this.state.actions.tag.deleteTagStart();
        return this.api.project.removeTagFromTagFamily({ project, tagFamilyUuid: tag.tagFamily.uuid, tagUuid: tag.uuid})
        .toPromise()
        .then(() => {
            this.state.actions.tag.deleteTagSuccess(tag.uuid);
            return null;
        }, error => {
            this.state.actions.tag.deleteTagError();
            this.notification.show({
                type: 'error',
                message: 'admin.tag_deleted_error',
                translationParams: { tagName: tag.name }
            });
            throw error;
        });
    }

    createTagFamily(project: string, name: string): Promise<TagFamilyResponse > {
        this.state.actions.tag.createTagFamilyStart();
        return this.api.project.createTagFamily({ project }, { name }).toPromise()
        .then(response => {
            this.state.actions.tag.createTagFamilySuccess(response);
            return response;
        }, error => {
            this.state.actions.tag.createTagFamilyError();
            this.notification.show({
                type: 'error',
                message: 'project.create_tag_family_error'
            });
            throw error;
        });
    }

    updateTagFamily(project: string, tagFamilyUuid: string, name: string): Promise<TagFamilyResponse > {
        this.state.actions.tag.updateTagFamilyStart();
        return this.api.project.updateTagFamily({ project, tagFamilyUuid }, { name }).toPromise()
        .then(response => {
            this.state.actions.tag.updateTagFamilySuccess(response);
            return response;
        }, error => {
            this.state.actions.tag.updateTagFamilyError();
            this.notification.show({
                type: 'error',
                message: 'project.create_tag_family_error'
            });
            throw error;
        });
    }

    deleteTagFamily(project: string, tagFamily: TagFamily): Promise<null> {
        this.state.actions.tag.deleteTagFamilyStart();
        return this.api.project.deleteTagFamily({ project, tagFamilyUuid: tagFamily.uuid})
        .toPromise()
        .then(() => {
            this.state.actions.tag.deleteTagFamilySuccess(tagFamily.uuid);
            return null;
        }, error => {
            this.state.actions.tag.deleteTagFamilyError();
            this.notification.show({
                type: 'error',
                message: 'admin.tag_family_deleted_error',
                translationParams: { tagFamilyName: tagFamily.name }
            });
            throw error;
        });
    }
}
