import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { Project } from '../../../common/models/project.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ProjectResponse } from '../../../common/models/server-models';

import { fuzzyMatch } from '../../../common/util/fuzzy-search';


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

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private route: ActivatedRoute,
                private i18n: I18nService,
                private modalService: ModalService,
                public adminProjectEffects: AdminProjectEffectsService,
                public router: Router) {}

    ngOnInit(): void {

        this.projectsLoading$ = this.state.select(state => state.list.loadCount > 0);
        this.adminProjectEffects.loadProjects();

        this.filterInput.valueChanges
            .debounceTime(100)
            .takeUntil(this.destroy$)
            .subscribe(term => {
                this.setQueryParams({ q: term });
            });

        this.observeParam('q', '').subscribe(filterTerm => {
                this.adminProjectEffects.setFilterTerm(filterTerm);
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        const allProjects$ = this.state.select(state => state.adminProjects.projectList)
            .map(uuids => uuids.map(uuid => this.entities.getProject(uuid)));

        const filterTerm$ = this.state.select(state => state.adminProjects.filterTerm);

        this.projects$ = combineLatest(allProjects$, filterTerm$)
            .map(([projects, filterTerm]) => {
                this.filterTerm = filterTerm;
                return projects.filter(project => fuzzyMatch(filterTerm, project.name) !== null);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onCreateProjectClick() {
        this.modalService.fromComponent(
            CreateProjectModalComponent,
            {
                closeOnOverlayClick: false,
                width: '90%',
                onClose: (reason: any): void => {}
            }
        )
        .then(modal => modal.open())
        .then((project: ProjectResponse) => {
            this.router.navigate(['/admin/projects', project.uuid]);
        });
    }

    deleteProject(project: Project): void {
        this.modalService.dialog({
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

    /**
     * Updates the query params whilst preserving existing params.
     */
    private setQueryParams(params: { [key: string]: string | number; }): void {
        this.router.navigate(['./'], {
            queryParams: params,
            queryParamsHandling: 'merge',
            relativeTo: this.route
        });
    }
}
