import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Project } from '../../../../common/models/project.model';
import { ApplicationStateService } from '../../../../state/providers/application-state.service';
import { hashValues } from '../../../../util';
import { ModalService } from 'gentics-ui-core';
import { CreateProjectModalComponent } from './components/create-project-modal/create-project-modal.component';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
    projects$: Observable<Project[]>;

    constructor(private state: ApplicationStateService,
                private modal: ModalService) {
        this.projects$ = state.select(state => state.entities.project)
            .map(hashValues);
    }

    create(): void {
        this.modal.fromComponent(CreateProjectModalComponent)
            .then(modal => modal.open());
    }
}
