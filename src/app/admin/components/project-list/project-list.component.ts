import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { hashValues } from '../../../common/util/util';
import { Project } from '../../../common/models/project.model';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
    projects$: Observable<Project[]>;
    projectsLoading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private modal: ModalService,
                private listEffects: ListEffectsService) {
        this.projects$ = state.select(state => state.admin.displayedProjects)
            .map(uuids => uuids.map(uuid => state.now.entities.project[uuid]));

        this.projectsLoading$ = state.select(state => state.list.loadCount > 0);
        this.listEffects.loadProjects();
    }

    create(): void {
        this.modal.fromComponent(CreateProjectModalComponent)
            .then(modal => modal.open());
    }
}
