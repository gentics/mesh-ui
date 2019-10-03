import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project } from '../../../common/models/project.model';
import { hashValues } from '../../../common/util/util';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

interface ProjectHash {
    [uuid: string]: Project;
}

@Component({
    selector: 'mesh-project-switcher',
    templateUrl: './project-switcher.component.html',
    styleUrls: ['./project-switcher.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSwitcherComponent {
    projects$: Observable<Project[]>;

    constructor(private appState: ApplicationStateService, private navigation: NavigationService) {
        this.projects$ = this.appState.select(state => state.entities.project).pipe(map(hashValues));
    }

    changeProject(project: Project) {
        this.navigation.list(project.name, project.rootNode.uuid).navigate();
    }
}
