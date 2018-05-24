import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ModalService } from 'gentics-ui-core';

import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { Project } from '../../../common/models/project.model';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { TagFamily } from '../../../common/models/tag-family.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { hashValues } from '../../../common/util/util';
import { Tag } from '../../../common/models/tag.model';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { NameInputDialogComponent } from '../name-input-dialog/name-input-dialog.component';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { ProjectResponse, TagFamilyResponse } from '../../../common/models/server-models';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';

enum TagStatus { // The numbers indicate the order the tags and families will be saved
    DELETED = 1,
    EDITED = 2,
    NEW = 3,
    PRISTINE = 4,
}

interface LocalTag {
    status: TagStatus,
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
    public tagFamilies: LocalTagFamily[] = null;

    private form: FormGroup = null;
    private filterInput = new FormControl('');
    private tagFilterTerm = '';
    private readOnly = true;
    private tagsChanged = false;

    private destroy$ = new Subject<void>();
    private tagListener$: Subject<void> = null;

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
        public projectEffect: AdminProjectEffectsService,
        public tagEffects: TagsEffectsService,
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

                this.tagEffects.loadTagFamiliesAndTheirTags(project.name);
            });

        this.filterInput.valueChanges
            .debounceTime(100)
            .takeUntil(this.destroy$)
            .subscribe(term => {
                this.setQueryParams({ q: term });
            });

        this.observeParam('q', '')
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
        this.tagListener$ = new Subject<void>();
        combineLatest(
            this.state.select(state => state.tags.tagFamilies),
            this.state.select(state => state.tags.tags),
            this.state.select(state => state.entities.tagFamily),  // We need to subscribe to entities because editing of a family name does not alter the state.tag[s] state
            this.state.select(state => state.entities.tag) // We need to subscribe to entities because editing of a tag name of does not alter the state.tag[s] state
        )
            .takeUntil(this.tagListener$)
            .map(([families, tags]) => {
                const allTags = this.entities.getAllTags();
                return Object.values(families)
                    .sort((fam1, fam2) => this.entities.getTagFamily(fam1).name < this.entities.getTagFamily(fam2).name ? -1 : 1)
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
                        const localTagFamily: LocalTagFamily = {
                            status: TagStatus.PRISTINE,
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

    addTagClick(tagFamily: LocalTagFamily): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => { }
            },
            {
                title: this.i18n.translate('admin.create_tag'),
                label: this.i18n.translate('admin.tag'),
                value: '',
            }
        )
            .then(modal => modal.open())
            .then(result => {
                if (tagFamily.tags.some(tag => tag.data.name === result)) {
                    const tag = tagFamily.tags.find(tag => tag.data.name === result);
                    tag.status = TagStatus.EDITED;
                    this.flagIfTagsHasChanged();
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

    updateTagClick(tag: LocalTag, family: LocalTagFamily, error: string = null): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => { }
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

    createTagFamilyClick(): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => { }
            },
            {
                title: this.i18n.translate('admin.create_tag_family'),
                label: this.i18n.translate('common.title_label'),
                value: ''
            }
        )
            .then(modal => modal.open())
            .then(result => {
                if (this.tagFamilies.some(family => family.data.name === result)) {
                    const family = this.tagFamilies.find(family => family.data.name === result);
                    family.status = TagStatus.EDITED;
                    this.flagIfTagsHasChanged();
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

    updateTagFamilyClick(family: LocalTagFamily, error: string = null): void {
        this.modalService.fromComponent(
            NameInputDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => { }
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
                } else { //otherwise mark as deleted
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

    syncFamilyTags(project:Project, localFamily: LocalTagFamily, remoteFamily: TagFamily): Promise<any | void>[] {
        const tagRequests: Promise<any | void>[] = [];
        if (localFamily.status !== TagStatus.DELETED) {

            localFamily.tags = localFamily.tags.filter(tag => { // We will instantely remove the deleted tags.
                switch (tag.status) {
                    case TagStatus.NEW:
                        tagRequests.push(this.tagEffects.createTag(project.name, remoteFamily.uuid, tag.data.name)
                            .then(result => {
                                tag.status = TagStatus.PRISTINE;
                                tag.data = result;
                                return result;
                            }));
                        return true;


                    case TagStatus.EDITED:
                        tagRequests.push(this.tagEffects.updateTag(project.name, remoteFamily.uuid, (tag.data as Tag).uuid, tag.data.name)
                            .then(result => {
                                tag.status = TagStatus.PRISTINE;
                                tag.data = result;
                                return result;
                            }));
                        return true;


                    case TagStatus.DELETED:
                        tagRequests.push(this.tagEffects.deleteTag(project.name, (tag.data as Tag)));
                        return false;

                    default:
                        return true;
                }
            });
        }
        return tagRequests;
    }

    syncFamilies(project: Project): Promise<any | void>[] {
        const tagRequests: Promise<any | void>[] = [];

        if (this.tagsChanged) {
            this.tagFamilies = this.tagFamilies.sort((fam1, fam2) => {
                return fam1.status < fam2.status ? -1 : 1;
            })
            .filter((family) => {
                switch (family.status) {
                    case TagStatus.NEW:
                        const createRequest = this.tagEffects.createTagFamily(project.name, family.data.name)
                                                    .then(result => {
                                                        family.status = TagStatus.PRISTINE;
                                                        family.data = result;
                                                        tagRequests.push(...this.syncFamilyTags(project, family, result));
                                                    });
                        tagRequests.push(createRequest);
                        return true;

                        case TagStatus.EDITED:
                        const editRequest = this.tagEffects.updateTagFamily(project.name, (family.data as TagFamily).uuid, family.data.name)
                                                .then(result => {
                                                    family.status = TagStatus.PRISTINE;
                                                    family.data = result;
                                                    tagRequests.push(...this.syncFamilyTags(project, family, result));
                                                })
                        tagRequests.push(editRequest);
                        return true;

                    case TagStatus.DELETED:
                        tagRequests.push(this.tagEffects.deleteTagFamily(project.name, family.data as TagFamily));
                        return false;

                    default:
                        tagRequests.push(...this.syncFamilyTags(project, family, family.data as TagFamily));
                        return true;
                }
            });
        }
        return tagRequests;
    }

    getFilteredFamilies(): LocalTagFamily[] {
        return this.tagFamilies.filter(fam => {
            return fam.status !== TagStatus.DELETED;
        })
        .sort((fam1, fam2) => {
            return fam1.data.name.toLowerCase() < fam2.data.name.toLowerCase() ? -1 : 1;
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

    persistProject() {
        this.tagListener$.next();
        this.tagListener$.complete();

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
                this.fetchTags();
                this.tagsChanged = false;
                this.form.markAsPristine();
            });
    }

    /**
     * Returns an Observable which emits whenever a route query param with the given name changes.
     */
    private observeParam<T extends string | number>(paramName: string, defaultValue: T): Observable<T> {
        return this.route.queryParamMap
            .map(paramMap => {
                const value = paramMap.get(paramName) as T || defaultValue;
                return (typeof defaultValue === 'number' ? +value : value) as T;
            })
            .distinctUntilChanged()
            .takeUntil(this.destroy$);
    }

    private setQueryParams(params: { [key: string]: string | number; }): void {
        this.router.navigate(['./'], {
            queryParams: params,
            queryParamsHandling: 'merge',
            relativeTo: this.route
        });
    }
}
