import { Injectable } from '@angular/core';
import { Response } from '@angular/http/src/static_response';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ProjectCreateRequest, ProjectResponse, TagFamilyResponse, TagResponse } from '../../../common/models/server-models';
import { TagFamily } from '../../../common/models/tag-family.model';


@Injectable()
export class TagsEffectsService {

    constructor(private api: ApiService,
                private notification: I18nNotification,
                private state: ApplicationStateService) {
    }

    createTagFamily(project: string, name: string): Promise<TagFamilyResponse > {
        this.state.actions.tags.actionStart();
        return this.api.project.createTagFamily({ project }, { name }).toPromise()
        .then(response => {
            this.state.actions.tags.createTagFamilySuccess(response);
            return response;
        }, error => {
            this.state.actions.tags.actionError();
            this.notification.show({
                type: 'error',
                message: 'project.create_tag_family_error'
            });
            return null;
        });
    }

    createTag(project: string, tagFamilyUuid: string, name: string): Promise<TagResponse> {
        this.state.actions.tags.actionStart();
        return this.api.project.createTag({project, tagFamilyUuid}, { name }).toPromise()
        .then(response => {
            this.state.actions.tags.createTagSuccess(response);
            return response;
        }, error => {
            this.state.actions.tags.actionError();
            this.notification.show({
                type: 'error',
                message: 'project.create_tag_error'
            });
            return null;
        });
    }

    // Load tag families and their sibling tags for a project
    loadTagFamiliesAndTheirTags(project: string): void {
        this.state.actions.tags.actionStart();
        this.api.project.getTagFamilies({ project })
        .subscribe(tagFamiesResponse => {
            this.state.actions.tags.fetchTagFamiliesSuccess(tagFamiesResponse.data);
            tagFamiesResponse.data.forEach((tagFamily: TagFamily) => this.loadTagsOfTagFamily(project, tagFamily.uuid));
        }, error => {
            this.state.actions.tags.actionError();
            this.notification.show({
                type: 'error',
                message: 'editor.load_tags_error'
            });
        });
    }


    loadTagsOfTagFamily(project: string, tagFamilyUuid: string): void {
        this.state.actions.tags.actionStart();
        this.api.project.getTagsOfTagFamily({project, tagFamilyUuid})
        .subscribe(response => {
            this.state.actions.tags.fetchTagsOfTagFamilySuccess(response.data);
        }, error => {
            this.state.actions.tags.actionError();
            this.notification.show({
                type: 'error',
                message: 'editor.load_tags_error'
            });
        });
    }
}
