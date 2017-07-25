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

    create(projectRequest: ProjectCreateRequest): Promise<ProjectResponse> {
        return this.api.admin.createProject({}, projectRequest)
        .do(project => {
            this.state.actions.admin.createProject(project);
            this.notification.show({
                type: 'success',
                message: 'admin.project_created'
            });
        })
        .toPromise();
    }
}
