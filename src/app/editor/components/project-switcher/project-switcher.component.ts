import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { hashValues } from '../../../common/util/util';
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

    constructor(private appState: ApplicationStateService,
                private navigation: NavigationService) {

        this.projects$ = this.appState.select(state => state.entities.project)
            .map(hashValues);
    }

    changeProject(project: Project) {
        this.navigation.list(project.name, project.rootNode.uuid).navigate();
    }
}
