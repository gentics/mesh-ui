import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ApplicationStateService } from '../../../../state/providers/application-state.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../common/models/project.model';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './project-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailComponent {
    project$: Observable<Project>;

    constructor(state: ApplicationStateService,
                route: ActivatedRoute) {
        this.project$ = route.params.switchMap(params =>
            state.select(state => state.entities.project[params['uuid']]));
    }
}
