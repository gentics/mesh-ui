import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';

@Injectable()
export class ProjectEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
    }

    loadProjects() {
        this.state.actions.admin.loadProjectsStart();
        // TODO How to handle paging? Should all projects be loaded?
        this.api.project.getProjects({})
            .subscribe(projects => {
                // TODO Remove exclamation mark as soon as typing is fixed
                this.state.actions.admin.loadProjectsEnd(projects.data!);
            });
    }
}
