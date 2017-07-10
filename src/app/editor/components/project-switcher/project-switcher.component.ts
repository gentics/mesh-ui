import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { hashValues } from '../../../common/util/util';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { Project } from '../../../common/models/project.model';

interface ProjectHash {
    [uuid: string]: Project;
}

@Component({
    selector: 'project-switcher',
    templateUrl: './project-switcher.component.html',
    styleUrls: ['./project-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<Project[]>;
    currentProjectName$: Observable<string>;

    constructor(private appState: ApplicationStateService,
                private navigation: NavigationService,
                private listEffects: ListEffectsService) {

        this.projects$ = this.appState.select(state => state.entities.project)
            .map(hashValues)
            .do(projects => {
                // TODO Ask if this is ok or if there is a better way
                if (projects.length === 0) {
                    this.listEffects.loadProjects();
                }
            });


        this.currentProjectName$ = this.appState.select(state =>
            this.getProjectByName(state.entities.project, this.appState.now.editor.openNode.projectName))
            .filter(Boolean)
            .map(it => it.name);
    }

    changeProject(project: Project) {
        this.navigation.list(project.name, project.rootNode.uuid).navigate();
    }

    private getProjectByName(projects: ProjectHash, projectName: string): Project | undefined {
        for (const key in projects) {
            if (projects[key].name === projectName) {
                return projects[key];
            }
        }
    }
}
