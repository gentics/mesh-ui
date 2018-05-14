import { Component, OnInit, OnDestroy } from '@angular/core';
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




@Component({
    selector: 'mesh-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;

    project: Project;
    form: FormGroup;
    isNew = false;
    readOnly = true;

    private tagFamilies$: Observable<{familyData: TagFamily, tags: Tag[]}[]>;
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
    ) { }

    ngOnInit() {
        const project$: Observable <Project | undefined> = this.route.data.map(data => data.project);

        project$.takeUntil(this.destroy$)
            .subscribe(project => {
                this.project = project;
                this.isNew = !project;
                this.readOnly = !!project && !project.permissions.update;
                this.form = this.formBuilder.group({
                    name: [project ? project.name : '', Validators.required],
                });

                if (!this.isNew) {
                    this.tagEffects.loadTagFamiliesAndTheirTags(project.name);
                }
            });

        this.tagFamilies$ = combineLatest(
                this.state.select(state => state.tags.tagFamilies),
                this.state.select(state => state.tags.tags),
                this.state.select(state => state.entities.tagFamily),  // We need to subscribe to entities because editing of a family name does not alter the state.tag[s] state
                this.state.select(state => state.entities.tag) // We need to subscribe to entities because editing of a tag name of does not alter the state.tag[s] state
            )
            .map(([families, tags]) => {
                const allTags = this.entities.getAllTags();
                return Object.values(families)
                    .sort((fam1, fam2) => this.entities.getTagFamily(fam1).name < this.entities.getTagFamily(fam2).name ? -1 : 1)
                    .map(family => {
                    return {
                        familyData: this.entities.getTagFamily(family),
                        tags: allTags.filter(tag => tag.tagFamily.uuid === family)
                    };
                });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    isSaveButtonEnabled(): boolean {
        return this.form.dirty && this.form.valid && !this.readOnly;
    }

    addTagClick(tagFamilyName: string): void {
        this.modalService.fromComponent(
            CreateTagDialogComponent,
            {
                closeOnOverlayClick: false
            },
            {
                newTagName: '',
                projectName: this.project.name,
                inputTagFamilyValue: tagFamilyName
            }
        )
        .then(modal => modal.open());
    }

    updateTagClick(tag: Tag): void {
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
                value: tag.name,
            }
        )
        .then(modal => modal.open())
        .then(result => {
            this.tagEffects.updateTag(this.project.name, tag.tagFamily.uuid, tag.uuid, result);
        });
    }

    deleteTagClick(tag: Tag): void {
        this.modalService.dialog({
            title: this.i18n.translate('admin.delete_tag') + '?',
            body: this.i18n.translate('admin.delete_tag_confirmation', tag.name),
            buttons: [
                { type: 'secondary', flat: true, shouldReject: true, label: this.i18n.translate('common.cancel_button') },
                { type: 'alert', label: this.i18n.translate('admin.delete_label') }
            ]
        })
        .then(modal => modal.open())
        .then(() => {
            this.tagEffects.deleteTag(this.project.name, tag);
        });
    }

    deleteTagFamilyClick(tagFamily: TagFamily): void {
        this.modalService.dialog({
            title: this.i18n.translate('admin.delete_tag_family') + '?',
            body: this.i18n.translate('admin.delete_tag_family_confirmation', tagFamily.name),
            buttons: [
                { type: 'secondary', flat: true, shouldReject: true, label: this.i18n.translate('common.cancel_button') },
                { type: 'alert', label: this.i18n.translate('admin.delete_label') }
            ]
        })
        .then(modal => modal.open())
        .then(() => {
            this.tagEffects.deleteTagFamily(this.project.name, tagFamily);
        });
    }

    updateTagFamilyClick(family: TagFamily): void {
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
                value: family.name,
            }
        )
        .then(modal => modal.open())
        .then(result => {
            this.tagEffects.updateTagFamily(this.project.name, family.uuid, result)
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
            this.tagEffects.createTagFamily(this.project.name, result);
        });
    }

    persistProject() {
        const formValue = this.form.value;
        this.projectEffect.updateProject(this.project.uuid, { name: formValue.name})
            .then(project => {
                if (project) {
                    this.form.markAsPristine();
                }
            });
    }
}
