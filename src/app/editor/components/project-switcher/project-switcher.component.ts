import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Project } from '../../../common/models/project.model';
import { NavigationService } from '../../../shared/providers/navigation/navigation.service';
import { hashValues } from '../../../common/util/util';
import { ProjectResponse } from '../../../common/models/server-models';

type ProjectHash = { [uuid: string]: ProjectResponse };

@Component({
    selector: 'project-switcher',
    templateUrl: './project-switcher.component.html',
    styleUrls: ['./project-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<ProjectResponse[]>;
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

    changeProject(project: ProjectResponse) {
        this.navigation.list(project.name, project.rootNode.uuid).navigate();
    }

    private getProjectByName(projects: ProjectHash, projectName: string): ProjectResponse {
        return hashValues(projects).filter(it => it.name === projectName)[0];
    }
}
