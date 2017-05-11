import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { hashValues } from '../../../common/util/util';
import { ProjectResponse } from '../../../common/models/server-models';
import { ProjectEffectsService } from '../../../core/providers/project-effects.service';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
    projects$: Observable<ProjectResponse[]>;
    projectsLoading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private modal: ModalService,
                private effects: ProjectEffectsService) {
        this.projects$ = state.select(state => state.entities.project)
            .map(hashValues);

        this.projectsLoading$ = state.select(state => state.admin.projectsLoading);

        this.effects.loadProjects();
    }

    create(): void {
        this.modal.fromComponent(CreateProjectModalComponent)
            .then(modal => modal.open());
    }
}
