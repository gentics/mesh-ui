import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { Project } from '../../../common/models/project.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { Subject } from 'rxjs';
import { I18nService } from '../../../core/providers/i18n/i18n.service';


@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projects$: Observable<Project[]>;
    projectsLoading$: Observable<boolean>;

    filterInput = new FormControl('');

    private destroy$ = new Subject<void>();

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private modal: ModalService,
                private route: ActivatedRoute,
                private router: Router,
                private i18n: I18nService,
                private adminProjectEffects: AdminProjectEffectsService) {}

    ngOnInit(): void {
        this.projects$ = this.state.select(state => state.adminProjects.projectList)
            .map(uuids => uuids.map(uuid => this.entities.getProject(uuid)));

        this.projectsLoading$ = this.state.select(state => state.list.loadCount > 0);
        this.adminProjectEffects.loadProjects();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    deleteProject(project: Project): void {
        this.modal.dialog({
            title: this.i18n.translate('modal.delete_project_title'),
            body: this.i18n.translate('modal.delete_project_body', { name: project.name }),
            buttons: [
                { label: this.i18n.translate('common.cancel_button'), type: 'secondary', shouldReject: true },
                { label: this.i18n.translate('common.delete_button'), type: 'alert', returnValue: true }
            ]
        })
        .then(modal => modal.open())
        .then(() => 1/*this.adminProjectEffects.deleteProject(project.uuid)*/);
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
