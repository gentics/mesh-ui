import { Injectable } from '@angular/core';

import { TagFamilyResponse, TagResponse } from '../../../common/models/server-models';
import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ApiService } from '../api/api.service';
import { I18nNotification } from '../i18n-notification/i18n-notification.service';

@Injectable()
export class TagsEffectsService {
    constructor(
        private api: ApiService,
        private notification: I18nNotification,
        private state: ApplicationStateService
    ) {}

    loadTagFamiliesAndTheirTags(project: string): void {
        this.state.actions.tag.clearAll();
        this.state.actions.tag.loadTagFamiliesAndTheirTagsStart();
        this.api.project.getTagFamilies({ project }).subscribe(
            tagFamiesResponse => {
                this.state.actions.tag.fetchTagFamiliesSuccess(tagFamiesResponse.data);
                tagFamiesResponse.data.forEach((tagFamily: TagFamily) =>
                    this.loadTagsOfTagFamily(project, tagFamily.uuid)
                );
            },
            error => {
                this.state.actions.tag.loadTagFamiliesAndTheirTagsError();
            }
        );
    }

    loadTagsOfTagFamily(project: string, tagFamilyUuid: string): void {
        this.state.actions.tag.fetchTagsOfTagFamilyStart();
        this.api.project.getTagsOfTagFamily({ project, tagFamilyUuid }).subscribe(
            response => {
                this.state.actions.tag.fetchTagsOfTagFamilySuccess(response.data);
            },
            error => {
                this.state.actions.tag.fetchTagsOfTagFamilyError();
            }
        );
    }

    createTag(project: string, tagFamilyUuid: string, name: string): Promise<TagResponse> {
        this.state.actions.tag.createTagStart();
        return this.api.project
            .createTag({ project, tagFamilyUuid }, { name })
            .toPromise()
            .then(
                response => {
                    this.state.actions.tag.createTagSuccess(response);
                    return response;
                },
                error => {
                    this.state.actions.tag.createTagError();
                    throw error;
                }
            );
    }

    updateTag(project: string, tagFamilyUuid: string, tagUuid: string, name: string): Promise<TagResponse> {
        this.state.actions.tag.updateTagStart();
        return this.api.project
            .updateTag({ project, tagFamilyUuid, tagUuid }, { name })
            .toPromise()
            .then(
                response => {
                    this.state.actions.tag.updateTagSuccess(response);
                    return response;
                },
                error => {
                    this.state.actions.tag.updateTagError();
                    throw error;
                }
            );
    }

    deleteTag(project: string, tag: Tag): Promise<null> {
        this.state.actions.tag.deleteTagStart();
        return this.api.project
            .removeTagFromTagFamily({ project, tagFamilyUuid: tag.tagFamily.uuid, tagUuid: tag.uuid })
            .toPromise()
            .then(
                () => {
                    this.state.actions.tag.deleteTagSuccess(tag.uuid);
                    return null;
                },
                error => {
                    this.state.actions.tag.deleteTagError();
                    throw error;
                }
            );
    }

    createTagFamily(project: string, name: string): Promise<TagFamilyResponse> {
        this.state.actions.tag.createTagFamilyStart();
        return this.api.project
            .createTagFamily({ project }, { name })
            .toPromise()
            .then(
                response => {
                    this.state.actions.tag.createTagFamilySuccess(response);
                    return response;
                },
                error => {
                    this.state.actions.tag.createTagFamilyError();
                    throw error;
                }
            );
    }

    updateTagFamily(project: string, tagFamilyUuid: string, name: string): Promise<TagFamilyResponse> {
        this.state.actions.tag.updateTagFamilyStart();
        return this.api.project
            .updateTagFamily({ project, tagFamilyUuid }, { name })
            .toPromise()
            .then(
                response => {
                    this.state.actions.tag.updateTagFamilySuccess(response);
                    return response;
                },
                error => {
                    this.state.actions.tag.updateTagFamilyError();
                    throw error;
                }
            );
    }

    deleteTagFamily(project: string, tagFamily: TagFamily): Promise<null> {
        this.state.actions.tag.deleteTagFamilyStart();
        return this.api.project
            .deleteTagFamily({ project, tagFamilyUuid: tagFamily.uuid })
            .toPromise()
            .then(
                () => {
                    this.state.actions.tag.deleteTagFamilySuccess(tagFamily.uuid);
                    return null;
                },
                error => {
                    this.state.actions.tag.deleteTagFamilyError();
                    throw error;
                }
            );
    }
}
