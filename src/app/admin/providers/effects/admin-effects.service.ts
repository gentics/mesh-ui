import { Injectable } from '@angular/core';
import { Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/providers/api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';

@Injectable()
export class AdminEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService,
                private i18nNotification: I18nNotification,
                private notification: Notification) {
    }

    /**
     * Loads the assignments of a schema/microschema to all projects.
     * @param type
     * @param uuid
     */
    loadEntityAssignments(type: 'microschema' | 'schema', uuid: string) {
        const actions = this.state.actions.admin;
        actions.loadEntityAssignmentsStart();

        this.api.project.getProjects({}).subscribe(projects => {
            actions.loadEntityAssignmentProjectsSuccess(projects.data);
            if (projects.data.length === 0) {
                actions.loadEntityAssignmentsSuccess({});
            } else {
                // We use GraphQL here because otherwise we would have to do multiple requests
                this.api.graphQL({project: projects.data[0].name}, {
                    query: `
                    query($uuid: String)
                    {
                      entity: ${type}(uuid: $uuid) {
                        projects {
                          elements {
                            uuid
                          }
                        }
                      }
                    }
                    `,
                    variables: {
                        uuid
                    }
                }).subscribe(response => {
                    const entity = response.data.entity;
                    if (!entity) {
                        this.i18nNotification.show({
                            type: 'error',
                            message: 'common.not_found'
                        });
                        actions.loadEntityAssignmentsError();
                        return;
                    }
                    const allProjects =
                    projects.data
                        .map(project => project.uuid)
                        .reduce(reduceTo(false), {});
                    const assignedProjects =
                    entity.projects.elements
                        .map(elements => elements.uuid)
                        .reduce(reduceTo(true), {});

                    actions.loadEntityAssignmentsSuccess({...allProjects, ...assignedProjects});
                });
            }
        });
    }

    assignEntityToProject(type: 'schema' | 'microschema', entityUuid: string, projectName: string) {
        let apiFunction: () => Observable<any>;
        if (type === 'schema') {
            apiFunction = () => this.api.admin.assignSchemaToProject({project: projectName, schemaUuid: entityUuid}, undefined);
        } else if (type === 'microschema') {
            apiFunction = () => this.api.admin.assignMicroschemaToProject({project: projectName, microschemaUuid: entityUuid}, undefined);
        } else {
            throw new Error('type must be schema or microschema');
        }

        this.state.actions.admin.actionStart();
        apiFunction().subscribe(() => {
            this.state.actions.admin.actionSuccess();
        }, error => {
            this.i18nNotification.show({
                type: 'error',
                message: error.toString()
            });
            this.state.actions.admin.actionError();
        });
    }

    removeEntityFromProject(type: 'schema' | 'microschema', entityUuid: string, projectName: string) {
        let apiFunction: () => Observable<any>;
        if (type === 'schema') {
            apiFunction = () => this.api.admin.removeSchemaFromProject({project: projectName, schemaUuid: entityUuid});
        } else if (type === 'microschema') {
            apiFunction = () => this.api.admin.removeMicroschemaFromProject({project: projectName, microschemaUuid: entityUuid});
        } else {
            throw new Error('type must be schema or microschema');
        }

        this.state.actions.admin.actionStart();
        apiFunction().subscribe(() => {
            this.state.actions.admin.actionSuccess();
        }, error => {
            this.i18nNotification.show({
                type: 'error',
                message: error.toString()
            });
            this.state.actions.admin.actionError();
        });
    }
}

function reduceTo<T>(val: T) {
    return (obj, uuid) => ({...obj, [uuid]: val});
}
