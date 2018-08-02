import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { Project } from '../../../common/models/project.model';
import { ProjectCreateRequest, ProjectResponse, ProjectUpdateRequest } from '../../../common/models/server-models';
import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';

@Injectable()
export class AdminProjectEffectsService {
    constructor(
        private api: ApiService,
        private notification: I18nNotification,
        private entities: EntitiesService,
        private state: ApplicationStateService
    ) {}

    newProject(): void {
        this.state.actions.adminProjects.newProject();
    }

    openProject(uuid: string): Promise<Project | void> {
        this.state.actions.adminProjects.openProjectStart();

        return this.api.project
            .getProjectByUuid({ projectUuid: uuid })
            .toPromise()
            .then(
                response => {
                    this.state.actions.adminProjects.openProjectSuccess(response);
                    return response;
                },
                error => {
                    this.state.actions.adminProjects.openProjectError();
                }
            );
    }

    loadProjects(): any {
        this.state.actions.adminProjects.fetchProjectsStart();

        this.api.project.getProjects({}).subscribe(
            response => {
                this.state.actions.adminProjects.fetchProjectsSuccess(response.data);
                return response.data;
            },
            error => {
                this.state.actions.adminProjects.fetchProjectsError();
            }
        );
    }

    createProject(projectRequest: ProjectCreateRequest): Promise<ProjectResponse> {
        this.state.actions.adminProjects.createProjectStart();
        return this.api.admin
            .createProject({}, projectRequest)
            .toPromise()
            .then(project => {
                this.state.actions.adminProjects.createProjectSuccess(project);
                this.notification.show({
                    type: 'success',
                    message: 'admin.project_created'
                });
                return project;
            })
            .catch(error => {
                this.state.actions.adminProjects.createProjectError();
                throw error;
            });
    }

    updateProject(projectUuid: string, projectRequest: ProjectUpdateRequest): Promise<ProjectResponse> {
        this.state.actions.adminProjects.updateProjectStart();
        return this.api.admin
            .updateProject({ projectUuid }, projectRequest)
            .toPromise()
            .then(project => {
                this.state.actions.adminProjects.updateProjectSuccess(project);
                this.notification.show({
                    type: 'success',
                    message: 'admin.project_updated'
                });
                return project;
            })
            .catch(error => {
                this.state.actions.adminProjects.updateProjectError();
                throw error;
            });
    }

    deleteProject(projectUuid: string): void {
        this.state.actions.adminProjects.deleteProjectStart();

        this.api.admin.deleteProject({ projectUuid }).subscribe(
            () => {
                this.state.actions.adminProjects.deleteProjectSuccess(projectUuid);
                this.notification.show({
                    type: 'success',
                    message: 'admin.project_deleted'
                });
            },
            error => {
                this.state.actions.adminProjects.deleteProjectError();
                this.notification.show({
                    type: 'error',
                    message: 'admin.project_deleted_error'
                });
            }
        );
    }

    setFilterTerm(term: string): void {
        this.state.actions.adminProjects.setFilterTerm(term);
    }

    setTagFilterTerm(term: string): void {
        this.state.actions.adminProjects.setTagFilterTerm(term);
    }
}
