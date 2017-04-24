import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../../state/models/Mesh/project.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'project-overview',
    templateUrl: 'project-overview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectOverviewComponent {
    projects$: Observable<Project[]>;

    constructor(private appState: ApplicationStateService) {
        this.projects$ = this.appState.select(state => state.entities.projects)
                                      .map(this.values);
    }

    // TODO Replace with utility function in central class
    private values<T>(object: {[key: string]: T}): T[] {
        return Object.keys(object).map(key => object[key]);
    }
}
