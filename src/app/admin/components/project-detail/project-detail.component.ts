import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { Project } from '../../../common/models/project.model';
import { ProjectResponse, TagFamilyResponse, TagResponse } from '../../../common/models/server-models';
import { TagFamily } from '../../../common/models/tag-family.model';
import { Tag } from '../../../common/models/tag.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { hashValues, notNullOrUndefined } from '../../../common/util/util';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { NameInputDialogComponent } from '../name-input-dialog/name-input-dialog.component';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { observeQueryParam } from '../../../shared/common/observe-query-param';

enum TagStatus {
    DELETED = 1,
    EDITED = 2,
    NEW = 3,
    PRISTINE = 4,
}

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

    public BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;
    public TagStatus = TagStatus;

    public project: Project;
    public tagFamilies: LocalTagFamily[] = [];

    private form: FormGroup;
    private filterInput = new FormControl('');
    private tagFilterTerm = '';
    private readOnly = true;
    private tagsChanged = false;

    private destroy$ = new Subject<void>();
    private preventTagFamiliesUpdate$: Subject<void>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private navigationService: NavigationService,
        private entities: EntitiesService,
        private state: ApplicationStateService,
        private modalService: ModalService,
        private i18n: I18nService,
        private changeDetector: ChangeDetectorRef,
        private projectEffect: AdminProjectEffectsService,
        private tagEffects: TagsEffectsService,
    ) { }

    ngOnInit() {
        const project$: Observable<Project> = this.route.data.map(data => data.project).filter(notNullOrUndefined);

        project$.takeUntil(this.destroy$)
            .subscribe(project => {
                this.project = project;
                this.readOnly = !!project && !project.permissions.update;
                this.form = this.formBuilder.group({
                    name: [project ? project.name : '', Validators.required],
                });

                this.tagEffects.loadTagFamiliesAndTheirTags(project.name);
            });

        this.filterInput.valueChanges
            .debounceTime(100)
            .takeUntil(this.destroy$)
            .subscribe(term => {
                setQueryParams(this.router, this.route, { q: term });
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
        .takeUntil(this.destroy$)
        .subscribe(filterTerm => {
            this.projectEffect.setTagFilterTerm(filterTerm);
            this.filterInput.setValue(filterTerm, { emitEvent: false });
        });

        this.state.select(state => state.adminProjects.filterTagsTerm)
        .takeUntil(this.destroy$)
        .subscribe(result => {
            this.tagFilterTerm = result.toLowerCase();
            this.changeDetector.markForCheck();
        });

        this.fetchTags();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    fetchTags(): void {
        this.preventTagFamiliesUpdate$ = new Subject<void>();
        combineLatest(
            this.state.select(state => state.tags.tagFamilies),
            this.state.select(state => state.tags.tags),
            this.state.select(state => state.entities.tagFamily),  // We need to subscribe to entities because editing of a family name does not alter the state.tag[s] state
            this.state.select(state => state.entities.tag) // We need to subscribe to entities because editing of a tag name of does not alter the state.tag[s] state
        )
            .takeUntil(this.preventTagFamiliesUpdate$)
            .map(([families, tags]) => {
                const allTags = this.entities.getAllTags();
                return Object.values(families)
                    .map(family => {
                        const familyTags = allTags.filter(tag => tag.tagFamily.uuid === family)
                            .map(tag => {
                                const localTag: LocalTag = {
                                    status: TagStatus.PRISTINE,
                                    data: tag
                                };
                                return localTag;
                            });

                        const familyData = this.entities.getTagFamily(family);

                        if (!familyData) {
                            return null;
                        }

                        const localTagFamily: LocalTagFamily = {
                            status: TagStatus.PRISTINE,
                            data: familyData,
                            tags: familyTags
                        };
                        return localTagFamily;
                    })
                    .filter(notNullOrUndefined);
            })
            .subscribe(families => {
                this.tagFamilies = families;
                this.changeDetector.markForCheck();
            });
    }

    addTagClick(tagFamily: LocalTagFamily, error: string | null = null): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%'
            },
            {
                title: this.i18n.translate('admin.create_tag'),
                label: this.i18n.translate('admin.tag'),
                value: '',
                error
            }
        )
            .then(modal => modal.open())
            .then(result => {
                if (tagFamily.tags.some(tag => tag.data.name === result)) {
                    const tag = tagFamily.tags.find(tag => tag.data.name === result);
                    this.addTagClick(tagFamily, this.i18n.translate('admin.duplicate_tag', { tag: result }));
                } else {
                    const newLocalTag: LocalTag = {
                        status: TagStatus.NEW,
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
                    tagFamily.tags = [...tagFamily.tags, newLocalTag];
                }
                this.flagIfTagsHasChanged();
            });
    }

    updateTagClick(tag: LocalTag, family: LocalTagFamily, error: string | null = null): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%'
            },
            {
                title: this.i18n.translate('admin.edit_tag'),
                label: this.i18n.translate('common.title_label'),
                value: tag.data.name,
                error
            }
        )
            .then(modal => modal.open())
            .then(result => {
                if (family.tags.some(existingTag =>
                    existingTag !== tag &&
                    existingTag.status !== TagStatus.DELETED &&
                    existingTag.data.name === result)) {
                    this.updateTagClick(tag, family, this.i18n.translate('admin.duplicate_tag', { tag: result }));
                } else {
                    // If this was a newly created tag, leave it marked as new, so that the saving mechanism know it has to create it
                    if (tag.status !== TagStatus.NEW) {
                        tag.status = TagStatus.EDITED;
                    }

                    tag.data = { ...tag.data, name: result };
                    this.flagIfTagsHasChanged();
                }
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
                if (tag.status === TagStatus.NEW) { // If this was a newly created tag, delete it out of awarness right away.
                    family.tags = family.tags.filter(familyTag => familyTag !== tag);
                } else {
                    tag.status = TagStatus.DELETED;
                }

                this.flagIfTagsHasChanged();
            });
    }

    createTagFamilyClick(error: string | null = null): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%'
            },
            {
                title: this.i18n.translate('admin.create_tag_family'),
                label: this.i18n.translate('common.title_label'),
                value: '',
                error,
            }
        )
            .then(modal => modal.open())
            .then(result => {
                if (this.tagFamilies.some(family => family.data.name === result)) {
                    const family = this.tagFamilies.find(family => family.data.name === result);
                    this.createTagFamilyClick(this.i18n.translate('admin.duplicate_tag_family', { family: result }));
                } else {
                    const newLocalTagFamily: LocalTagFamily = {
                        status: TagStatus.NEW,
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
                }
            });
    }

    updateTagFamilyClick(family: LocalTagFamily, error: string | null = null): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%'
            },
            {
                title: this.i18n.translate('admin.edit_tag_family'),
                label: this.i18n.translate('common.title_label'),
                value: family.data.name,
                error
            }
        )
            .then(modal => modal.open())
            .then(result => {

                if (this.tagFamilies.some(existingFamily =>
                    existingFamily !== family &&
                    existingFamily.status !== TagStatus.DELETED &&
                    existingFamily.data.name === result)) {
                    this.updateTagFamilyClick(family, this.i18n.translate('admin.duplicate_tag_family', { family: result }));
                } else {
                    // If it's a newly created family, leave it marked as TagStatus.NEW anyways,
                    // so that the saving mechanism knows it has to be created instead of updated.
                    if (family.status !== TagStatus.NEW) {
                        family.status = TagStatus.EDITED;
                    }

                    family.data = { ...family.data, name: result };
                    this.flagIfTagsHasChanged();
                }
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
                if (tagFamily.status === TagStatus.NEW) { // If this is a newly created family, delete it out of awarnes.
                    this.tagFamilies = this.tagFamilies.filter(fam => fam !== tagFamily);
                } else { // otherwise mark as deleted
                    tagFamily.status = TagStatus.DELETED;
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

    getFilteredFamilies(): LocalTagFamily[] {
        return this.tagFamilies.filter(fam => {
            return fam.status !== TagStatus.DELETED;
        })
        .sort((fam1, fam2) => {
            return fam1.data.name!.toLowerCase() < fam2.data.name!.toLowerCase() ? -1 : 1;
        });
    }

    getFilteredTags(tags: LocalTag[]): LocalTag[] {
        return tags.filter(tag => {
            return tag.status !== TagStatus.DELETED && fuzzyMatch(this.tagFilterTerm, tag.data.name);
        })
        .sort((tag1, tag2) => {
            return tag1.data.name.toLowerCase() < tag2.data.name.toLowerCase() ? -1 : 1;
        });
    }

    updateTags (project: Project, family: LocalTagFamily): Promise<void> {
        const tagRequests: Promise<any | void>[] = [];
        family.tags.filter(tag => tag.status !== TagStatus.DELETED)
            .map(async tag => {
                let result: TagResponse | null;
                switch (tag.status) {
                    case TagStatus.NEW:
                        result = await this.tagEffects.createTag(project.name, (family.data as TagFamily).uuid, tag.data.name);
                        break;
                    case TagStatus.EDITED:
                        result = await this.tagEffects.updateTag(project.name, (family.data as TagFamily).uuid, (tag.data as Tag).uuid, tag.data.name!);
                        break;
                    default:
                        result = null;
                        break;
                }

                if (result) {
                    tag.status = TagStatus.PRISTINE;
                    tag.data = result;
                }
                tagRequests.push(Promise.resolve());
            });

        return Promise.all(tagRequests).then(() => Promise.resolve());
    }

    deleteMarkedTags(project: Project, localFamily: LocalTagFamily): Promise<void> {
        const deleteRequests: Promise<any | void>[] = [];

        localFamily.tags.filter(tag => tag.status === TagStatus.DELETED)
            .map(tag => {
                deleteRequests.push(this.tagEffects.deleteTag(project.name, (tag.data as Tag)));
            });

        return Promise.all(deleteRequests).then(() => Promise.resolve());
    }

    updateTagFamilies(project: Project): Promise<void> {
        const tagRequests: Promise<any | void>[] = [];

        this.tagFamilies.filter(family => family.status !== TagStatus.DELETED)
            .map(async family => {
                let result: TagFamilyResponse | null;
                switch (family.status) {
                    case TagStatus.NEW:
                        result = await this.tagEffects.createTagFamily(project.name, family.data.name!);
                        break;

                    case TagStatus.EDITED:
                        result = await this.tagEffects.updateTagFamily(project.name, (family.data as TagFamily).uuid, family.data.name!);
                        break;
                    default:
                        result = null;
                        break;
                }

                if (result) {
                    family.status = TagStatus.PRISTINE;
                    family.data = result;
                }

                await this.deleteMarkedTags(project, family);
                await this.updateTags(project, family);
                tagRequests.push(Promise.resolve());
            });

        return Promise.all(tagRequests).then(() => Promise.resolve());
    }

    deleteMarkedFamilies(project: Project): Promise<void> {
        const deleteRequests: Promise<any | void>[] = [];

        this.tagFamilies.filter(family => family.status === TagStatus.DELETED)
            .map(family => {
               deleteRequests.push(this.tagEffects.deleteTagFamily(project.name, family.data as TagFamily));
            });
        return Promise.all(deleteRequests).then(result => Promise.resolve());
    }

    async syncFamilies(project: Project): Promise<void> {
        if (!this.tagsChanged) {
            return Promise.resolve();
        }

        const tagRequests: Promise<any | void>[] = [];
        await this.deleteMarkedFamilies(project);
        await this.updateTagFamilies(project);

        return Promise.all(tagRequests).then(() => Promise.resolve());
    }

    persistProject() {
        this.preventTagFamiliesUpdate$.next();
        this.preventTagFamiliesUpdate$.complete();

        const formValue = this.form.value;
        const queue: Promise<any | void>[] = [];

        if (this.form.dirty && this.form.valid && !this.readOnly) {
            const projectUpdateRespose = this.projectEffect.updateProject(this.project.uuid, { name: formValue.name });
            projectUpdateRespose.then(response => {
                queue.push(this.syncFamilies(response));
            });
            queue.push(projectUpdateRespose);
        } else {
            queue.push(this.syncFamilies(this.project));
        }

        Promise.all(queue)
            .then(result => {
                this.fetchTags();
                this.tagsChanged = false;
                this.form.markAsPristine();
            });
    }
}
