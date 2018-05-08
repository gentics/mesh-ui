import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';
import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { Project } from '../../../common/models/project.model';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { TagFamily } from '../../../common/models/tag-family.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';


@Component({
    selector: 'mesh-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;

    form: FormGroup;
    isNew = false;
    readOnly = true;

    private tagFamilies$: Observable<TagFamily>;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private navigationService: NavigationService,
        private entities: EntitiesService,
        private adminUserEffects: AdminUserEffectsService,
        private tagEffects: TagsEffectsService,
        private state: ApplicationStateService,
    ) { }

    ngOnInit() {
        const project$: Observable <Project | undefined> = this.route.data.map(data => data.project);

        project$.takeUntil(this.destroy$)
            .subscribe(project => {
                this.isNew = !project;
                this.readOnly = !!project && !project.permissions.update;
                this.form = this.formBuilder.group({
                    name: [project ? project.name : '', Validators.required],
                });

                if (!this.isNew) {
                    this.tagEffects.loadTagFamiliesAndTheirTags(project.name);
                }
            });
        
        this.state.select(state => state.entities.tag)
            .takeUntil(this.destroy$)
            .subscribe(tags => {
                //console.log('Just received tags', tags);
                //TODO: group tags here
            })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    isSaveButtonEnabled(): boolean {
        /*const basicFormIsSavable = this.form.dirty && this.form.valid && !this.readOnly;
        if (this.formGenerator) {
            const formGeneratorIsSavable = this.formGenerator.isDirty && this.formGenerator.isValid;
            return (basicFormIsSavable && this.formGenerator.isValid) || formGeneratorIsSavable;
        } else {
            return basicFormIsSavable;
        }*/

        return false;
    }
}
