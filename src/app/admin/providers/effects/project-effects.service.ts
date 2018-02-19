import { Injectable } from '@angular/core';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ProjectCreateRequest, ProjectResponse } from '../../../common/models/server-models';


@Injectable()
export class ProjectEffectsService {

    constructor(private api: ApiService,
                private notification: I18nNotification,
                private state: ApplicationStateService) {
    }

    createProject(projectRequest: ProjectCreateRequest): Promise<ProjectResponse> {
        this.state.actions.admin.actionStart();
        return this.api.admin.createProject({}, projectRequest)
        .do(project => {
            this.state.actions.admin.createProjectSuccess(project);
            this.notification.show({
                type: 'success',
                message: 'admin.project_created'
            });
        }, this.state.actions.admin.actionError)
        .toPromise();
    }

    deleteProject(projectUuid: string): void {
        this.state.actions.admin.actionStart();

        this.api.admin.deleteProject({projectUuid})
        .subscribe(() => {
            this.state.actions.admin.deleteProjectSuccess(projectUuid);
            this.notification.show({
                type: 'success',
                message: 'admin.project_deleted'
            });
        }, error => {
            this.state.actions.admin.actionError();
            this.notification.show({
                type: 'error',
                message: 'admin.project_deleted_error'
            });
        });
    }
}
