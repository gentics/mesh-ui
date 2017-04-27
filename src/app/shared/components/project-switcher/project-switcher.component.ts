import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Project } from '../../../common/models/project.model';
import { Subject } from 'rxjs/Subject';
import { StateActionBranch } from 'immutablets';
import { NavigationService } from '../../providers/navigation/navigation.service';

type ProjectHash = { [uuid: string]: Project };

@Component({
    selector: 'project-switcher',
    templateUrl: 'project-switcher.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<Project[]>;
    currentProjectName$: Observable<String>;

    constructor(private appState: ApplicationStateService,
                private navigation: NavigationService) {
        this.projects$ = this.appState.select(state => state.entities.project)
            .map(this.values);

        this.currentProjectName$ = this.appState.select(state =>
            this.getProjectByName(state.entities.project, this.appState.now.editor.openNode.projectName))
            .filter(Boolean)
            .map(it => it.name);
    }

    private changeProject(project: Project) {
        this.navigation.list(project.name, project.rootNodeUuid).navigate();
    }

    private getProjectByName(projects: ProjectHash, projectName: string): Project {
        return this.values(projects).filter(it => it.name === projectName)[0];
    }

    // TODO Replace with utility function in central class
    private values<T>(object: { [key: string]: T } | { [key: number]: T }): T[] {
        return Object.keys(object).map(key => object[key]);
    }
}
