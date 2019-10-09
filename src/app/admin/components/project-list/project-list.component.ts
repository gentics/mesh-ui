import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { Project } from '../../../common/models/project.model';
import { ProjectResponse } from '../../../common/models/server-models';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projects$: Observable<Project[]>;
    filterTerm: string;
    projectsLoading$: Observable<boolean>;

    filterInput = new FormControl('');

    private destroy$ = new Subject<void>();

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private route: ActivatedRoute,
        private i18n: I18nService,
        private modalService: ModalService,
        public adminProjectEffects: AdminProjectEffectsService,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.projectsLoading$ = this.state.select(state => state.list.loadCount > 0);
        this.adminProjectEffects.loadProjects();

        this.filterInput.valueChanges
            .pipe(
                debounceTime(100),
                takeUntil(this.destroy$)
            )
            .subscribe(term => {
                setQueryParams(this.router, this.route, { q: term });
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
            .pipe(takeUntil(this.destroy$))
            .subscribe(filterTerm => {
                this.adminProjectEffects.setFilterTerm(filterTerm);
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        const allProjects$ = this.state
            .select(state => state.adminProjects.projectList)
            .pipe(map(uuids => uuids.map(uuid => this.entities.getProject(uuid)).filter(notNullOrUndefined)));

        const filterTerm$ = this.state.select(state => state.adminProjects.filterTerm);

        this.projects$ = combineLatest(allProjects$, filterTerm$).pipe(
            map(([projects, filterTerm]) => {
                this.filterTerm = filterTerm;
                return projects
                    .filter(project => fuzzyMatch(filterTerm, project.name) !== null)
                    .sort((pro1, pro2) => {
                        return pro1.name < pro2.name ? -1 : 1;
                    });
            })
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onCreateProjectClick() {
        this.modalService
            .fromComponent(
                CreateProjectModalComponent,
                {
                    closeOnOverlayClick: false,
                    width: '90%'
                },
                { projectName: this.filterInput.value }
            )
            .then(modal => modal.open())
            .then((project: ProjectResponse) => {
                this.router.navigate(['/admin/projects', project.uuid]);
            });
    }

    deleteProject(project: Project): void {
        this.modalService
            .dialog({
                title: this.i18n.translate('modal.delete_project_title'),
                body: this.i18n.translate('modal.delete_project_body', { name: project.name }),
                buttons: [
                    { label: this.i18n.translate('common.cancel_button'), type: 'secondary', shouldReject: true },
                    { label: this.i18n.translate('common.delete_button'), type: 'alert', returnValue: true }
                ]
            })
            .then(modal => modal.open())
            .then(() => this.adminProjectEffects.deleteProject(project.uuid));
    }
}
