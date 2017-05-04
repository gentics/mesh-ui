import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Project } from '../../../common/models/project.model';
import { Subject } from 'rxjs/Subject';
import { StateActionBranch } from 'immutablets';
import { NavigationService } from '../../../shared/providers/navigation/navigation.service';
import { hashValues } from '../../../util';

type ProjectHash = { [uuid: string]: Project };

@Component({
    selector: 'project-switcher',
    templateUrl: './project-switcher.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<Project[]>;
    currentProjectName$: Observable<String>;

    constructor(private appState: ApplicationStateService,
                private navigation: NavigationService) {
        this.projects$ = this.appState.select(state => state.entities.project)
            .map(hashValues);

        this.currentProjectName$ = this.appState.select(state =>
            this.getProjectByName(state.entities.project, this.appState.now.editor.openNode.projectName))
            .filter(Boolean)
            .map(it => it.name);
    }

    private changeProject(project: Project) {
        this.navigation.list(project.name, project.rootNodeUuid).navigate();
    }

    private getProjectByName(projects: ProjectHash, projectName: string): Project {
        return hashValues(projects).filter(it => it.name === projectName)[0];
    }
}
