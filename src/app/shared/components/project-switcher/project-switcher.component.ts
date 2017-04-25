import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Project } from '../../../common/models/project.model';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'project-switcher',
    templateUrl: 'project-switcher.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<Project[]>;
    currentProject$: Observable<Project>;

    constructor(private appState: ApplicationStateService) {
        this.projects$ = this.appState.select(state => state.entities.projects)
                                      .map(this.values);

        this.currentProject$ = this.appState.select(state => state.ui.currentProject)
                                   .map(projectUuid => this.appState.now.entities.projects[projectUuid]);
    }

    private changeProject(project: Project) {
        this.appState.actions.ui.setProject(project.uuid);
    }

    // TODO Replace with utility function in central class
    private values<T>(object: {[key: string]: T}): T[] {
        return Object.keys(object).map(key => object[key]);
    }
}
