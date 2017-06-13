import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { hashValues } from '../../../common/util/util';
import { ProjectResponse } from '../../../common/models/server-models';
import { ProjectEffectsService } from '../../../core/providers/effects/project-effects.service';

interface ProjectHash { [uuid: string]: ProjectResponse; }

@Component({
    selector: 'project-switcher',
    templateUrl: './project-switcher.component.html',
    styleUrls: ['./project-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<ProjectResponse[]>;
    currentProjectName$: Observable<string>;

    constructor(private appState: ApplicationStateService,
                private navigation: NavigationService,
                private effects: ProjectEffectsService) {
        this.projects$ = this.appState.select(state => state.entities.project)
            .map(hashValues)
            .do(projects => {
                // TODO Ask if this is ok or if there is a better way
                if (projects.length === 0) {
                    this.effects.loadProjects();
                }
            });


        this.currentProjectName$ = this.appState.select(state =>
            this.getProjectByName(state.entities.project, this.appState.now.editor.openNode.projectName))
            .filter(Boolean)
            .map(it => it.name);
    }

    changeProject(project: ProjectResponse) {
        this.navigation.list(project.name, project.rootNode.uuid).navigate();
    }

    private getProjectByName(projects: ProjectHash, projectName: string): ProjectResponse {
        return hashValues(projects).filter(it => it.name === projectName)[0];
    }
}
