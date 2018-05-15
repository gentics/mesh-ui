import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { Project } from '../../../common/models/project.model';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { TagFamily } from '../../../common/models/tag-family.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { hashValues } from '../../../common/util/util';
import { Tag } from '../../../common/models/tag.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ModalService } from 'gentics-ui-core';
import { CreateTagDialogComponent, CreateTagDialogComponentResult } from '../../../shared/components/create-tag-dialog/create-tag-dialog.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { NameInputDialogComponent } from '../name-input-dialog/name-input-dialog.component';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { ProjectResponse, TagFamilyResponse } from '../../../common/models/server-models';


/*enum TagStatus {
    PRISTINE,
    EDITED,
    DELETED,
    NEW,
}*/

type TagStatus = 'pristine' | 'edited' | 'deleted' | 'new';

interface LocalTag {
    status: TagStatus;
    data: Tag | {
        name: string,
        tagFamily: TagFamily | { name: string },
        permissions: {}
    };
}
interface LocalTagFamily {
    status: TagStatus;
    data: TagFamily | {
        name: string,
        permissions: {}
    };
    tags: LocalTag[];
}

@Component({
    selector: 'mesh-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;

    project: Project;
    form: FormGroup = null;
    readOnly = true;
    tagsChanged = false;

    private tagFamilies: LocalTagFamily[] = null;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private navigationService: NavigationService,
        private entities: EntitiesService,
        private projectEffect: AdminProjectEffectsService,
        private tagEffects: TagsEffectsService,
        private state: ApplicationStateService,
        private modalService: ModalService,
        private i18n: I18nService,
        private changeDetector: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        const project$: Observable<Project | undefined> = this.route.data.map(data => data.project);

        project$.takeUntil(this.destroy$)
            .subscribe(project => {
                this.project = project;
                this.readOnly = !!project && !project.permissions.update;
                this.form = this.formBuilder.group({
                    name: [project ? project.name : '', Validators.required],
                });

                console.log('i will load the families again', project.name);
                this.tagEffects.loadTagFamiliesAndTheirTags(project.name);
            });

        combineLatest(
            this.state.select(state => state.tags.tagFamilies),
            this.state.select(state => state.tags.tags),
            this.state.select(state => state.entities.tagFamily),  // We need to subscribe to entities because editing of a family name does not alter the state.tag[s] state
            this.state.select(state => state.entities.tag) // We need to subscribe to entities because editing of a tag name of does not alter the state.tag[s] state
        )
            .takeUntil(this.destroy$)
            .map(([families, tags]) => {
                const allTags = this.entities.getAllTags();
                return Object.values(families)
                    .sort((fam1, fam2) => this.entities.getTagFamily(fam1).name < this.entities.getTagFamily(fam2).name ? -1 : 1)
                    .map(family => {

                        const familyTags = allTags.filter(tag => tag.tagFamily.uuid === family)
                            .map(tag => {
                                const localTag: LocalTag = {
                                    status: 'pristine',
                                    data: tag
                                };
                                return localTag;
                            });

                        const familyData = this.entities.getTagFamily(family);
                        const localTagFamily: LocalTagFamily = {
                            status: 'pristine',
                            data: familyData,
                            tags: familyTags
                        };

                        return localTagFamily;
                    });
            })
            .subscribe(families => {
                this.tagFamilies = families;
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    addTagClick(tagFamily: LocalTagFamily): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => {

                }
            },
            {
                title: this.i18n.translate('admin.create_tag'),
                label: this.i18n.translate('admin.tag'),
                value: '',
            }
        )
            .then(modal => modal.open())
            .then(result => {
                //this.tagEffects.createTag(this.project.name, tagFamily.data.uuid, result);
                const newLocalTag: LocalTag = {
                    status: 'new',
                    data: {
                        name: result,
                        tagFamily: tagFamily.data,
                        permissions: {
                            'read': true,
                            'update': true,
                            'delete': true,
                        }
                    }
                };

                newLocalTag.status = 'new';
                tagFamily.tags = [...tagFamily.tags, newLocalTag];
                this.flagIfTagsHasChanged();
            });
    }

    updateTagClick(tag: LocalTag): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => {

                }
            },
            {
                title: this.i18n.translate('admin.update_tag'),
                label: this.i18n.translate('admin.tag'),
                value: tag.data.name,
            }
        )
            .then(modal => modal.open())
            .then(result => {
                //this.tagEffects.updateTag(this.project.name, tag.data.tagFamily.uuid, tag.data.uuid, result);

                // If this was a newly created tag, leave it marked as new, so that the saving mechanism know it has to create it
                if (tag.status !== 'new') {
                    tag.status = 'edited';
                }

                tag.data = { ...tag.data, name: result };
                this.flagIfTagsHasChanged();
            });
    }

    deleteTagClick(tag: LocalTag, family: LocalTagFamily): void {
        this.modalService.dialog({
            title: this.i18n.translate('admin.delete_tag') + '?',
            body: this.i18n.translate('admin.delete_tag_confirmation', tag.data.name),
            buttons: [
                { type: 'secondary', flat: true, shouldReject: true, label: this.i18n.translate('common.cancel_button') },
                { type: 'alert', label: this.i18n.translate('admin.delete_label') }
            ]
        })
            .then(modal => modal.open())
            .then(() => {
                //this.tagEffects.deleteTag(this.project.name, tag);

                if (tag.status === 'new') { // If this was a newly created tag, delete it out of awarness right away.
                    family.tags = family.tags.filter(familyTag => familyTag !== tag);
                } else {
                    tag.status = 'deleted';
                }

                this.flagIfTagsHasChanged();
            });
    }

    createTagFamilyClick(): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => {

                }
            },
            {
                title: this.i18n.translate('admin.create_tag_family'),
                label: this.i18n.translate('admin.tag_family'),
                value: ''
            }
        )
            .then(modal => modal.open())
            .then(result => {
                //this.tagEffects.createTagFamily(this.project.name, result);
                const newLocalTagFamily: LocalTagFamily = {
                    status: 'new',
                    data: {
                        name: result,
                        permissions: {
                            'read': true,
                            'update': true,
                            'delete': true,
                        }
                    },
                    tags: []
                };
                this.tagFamilies = [...this.tagFamilies, newLocalTagFamily];
                this.flagIfTagsHasChanged();
            });
    }

    updateTagFamilyClick(family: LocalTagFamily): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => {

                }
            },
            {
                title: this.i18n.translate('admin.update_tag_family'),
                label: this.i18n.translate('admin.tag_family'),
                value: family.data.name,
            }
        )
            .then(modal => modal.open())
            .then(result => {
                //this.tagEffects.updateTagFamily(this.project.name, family.uuid, result)

                 // If it's a newly created family, leave it marked as 'new' anyways,
                 // so that the saving mechanism knows it has to be created instead of updated.
                if (family.status !== 'new') {
                    family.status = 'edited';
                }

                family.data = { ...family.data, name: result };
                this.flagIfTagsHasChanged();
            });
    }

    deleteTagFamilyClick(tagFamily: LocalTagFamily): void {
        this.modalService.dialog({
            title: this.i18n.translate('admin.delete_tag_family') + '?',
            body: this.i18n.translate('admin.delete_tag_family_confirmation', tagFamily.data.name),
            buttons: [
                { type: 'secondary', flat: true, shouldReject: true, label: this.i18n.translate('common.cancel_button') },
                { type: 'alert', label: this.i18n.translate('admin.delete_label') }
            ]
        })
            .then(modal => modal.open())
            .then(() => {
                //this.tagEffects.deleteTagFamily(this.project.name, tagFamily);
                if (tagFamily.status === 'new') { // If this is a newly created family, delete it out of awarnes.
                    this.tagFamilies = this.tagFamilies.filter(fam => fam !== tagFamily);
                } else { //otherwise mark as deleted
                    tagFamily.status = 'deleted';
                }
                this.flagIfTagsHasChanged();
            });
    }

    flagIfTagsHasChanged() {
        this.tagsChanged = true;
        this.changeDetector.markForCheck();
    }

    isSaveButtonEnabled(): boolean {
        return (this.form.dirty && this.form.valid && !this.readOnly) || this.tagsChanged;
    }

    syncFamilyTags(project:Project, localFamily: LocalTagFamily, remoteFamily: TagFamily): Promise<any | void>[] {
        const tagRequests: Promise<any | void>[] = [];
        if (localFamily.status !== 'deleted') {
            localFamily.tags.map(tag => {
                switch (tag.status) {
                    case 'new':
                        tagRequests.push(this.tagEffects.createTag(project.name, remoteFamily.uuid, tag.data.name));
                    break;

                    case 'edited':
                        tagRequests.push(this.tagEffects.updateTag(project.name, remoteFamily.uuid, (tag.data as Tag).uuid, tag.data.name));
                    break;

                    case 'deleted':
                        tagRequests.push(this.tagEffects.deleteTag(project.name, (tag.data as Tag)));
                    break;

                    default:
                    break;
                }
            });
        }

        return tagRequests;
    }

    syncFamilies(project: Project): Promise<any | void>[] {
        const tagRequests: Promise<any | void>[] = [];

        if (this.tagsChanged) {
            this.tagFamilies.map((family) => {
                switch (family.status) {
                    case 'new':
                        const createRequest = this.tagEffects.createTagFamily(project.name, family.data.name)
                                                    .then(result => {
                                                        tagRequests.push(...this.syncFamilyTags(project, family, result));
                                                    });
                        tagRequests.push(createRequest);
                    break;
                    case 'edited':
                        const editRequest = this.tagEffects.updateTagFamily(project.name, (family.data as TagFamily).uuid, family.data.name)
                                                .then(result => {
                                                    tagRequests.push(...this.syncFamilyTags(project, family, result));
                                                })
                        tagRequests.push(editRequest);
                    break;
                    case 'deleted':
                        tagRequests.push(this.tagEffects.deleteTagFamily(project.name, family.data as TagFamily));
                    break;

                    default:
                        tagRequests.push(...this.syncFamilyTags(project, family, family.data as TagFamily));
                    break;
                }
            });
        }
        return tagRequests;
    }

    persistProject() {
        const formValue = this.form.value;
        const queue: Promise<any | void>[] = [];

        if (this.form.dirty && this.form.valid && !this.readOnly) {
            const projectUpdateRespose = this.projectEffect.updateProject(this.project.uuid, { name: formValue.name });
            projectUpdateRespose.then(response => {
                queue.push(...this.syncFamilies(response));
            });
            queue.push(projectUpdateRespose);
        } else {
            queue.push(...this.syncFamilies(this.project));
        }

        Promise.all(queue)
            .then(result => {
                this.form.markAsPristine();
            })
        /*this.projectEffect.updateProject(this.project.uuid, { name: formValue.name})
            .then(project => {
                if (project) {
                    this.form.markAsPristine();
                }
            });*/
    }
}
