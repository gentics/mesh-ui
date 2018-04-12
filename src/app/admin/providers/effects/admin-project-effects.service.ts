import { Injectable } from '@angular/core';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ProjectCreateRequest, ProjectResponse } from '../../../common/models/server-models';


@Injectable()
export class AdminProjectEffectsService {

    constructor(private api: ApiService,
                private notification: I18nNotification,
                private state: ApplicationStateService) {
    }

    loadProjects(): void {
        this.state.actions.adminProjects.fetchProjectsStart();

        this.api.project.getProjects({})
            .subscribe(
                response => {
                    this.state.actions.adminProjects.fetchProjectsSuccess(response.data);
                },
                error => {
                    this.state.actions.adminProjects.fetchProjectsError();
                }
            );
    }

    createProject(projectRequest: ProjectCreateRequest): Promise<ProjectResponse> {
        this.state.actions.adminProjects.createProjectStart();
        return this.api.admin.createProject({}, projectRequest)
            .do(
                project => {
                    this.state.actions.adminProjects.createProjectSuccess(project);
                    this.notification.show({
                        type: 'success',
                        message: 'admin.project_created'
                    });
                },
                () => this.state.actions.adminProjects.createProjectError()
            )
            .toPromise();
    }

    deleteProject(projectUuid: string): void {
        this.state.actions.adminProjects.deleteProjectStart();

        this.api.admin.deleteProject({projectUuid})
        .subscribe(() => {
            this.state.actions.adminProjects.deleteProjectSuccess(projectUuid);
            this.notification.show({
                type: 'success',
                message: 'admin.project_deleted'
            });
        }, error => {
            this.state.actions.adminProjects.deleteProjectError();
            this.notification.show({
                type: 'error',
                message: 'admin.project_deleted_error'
            });
        });
    }
}
