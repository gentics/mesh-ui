import { Injectable } from '@angular/core';
import { Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { Microschema } from '../../../common/models/microschema.model';
import { Schema } from '../../../common/models/schema.model';
import {
    MicroschemaCreateRequest,
    MicroschemaResponse,
    MicroschemaUpdateRequest,
    ProjectResponse,
    SchemaCreateRequest,
    SchemaResponse,
    SchemaUpdateRequest
} from '../../../common/models/server-models';
import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ProjectAssignments } from '../../../state/models/admin-schemas-state.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Injectable()
export class AdminSchemaEffectsService {
    constructor(
        private api: ApiService,
        private state: ApplicationStateService,
        private i18nNotification: I18nNotification,
        private notification: Notification
    ) {}

    setListPagination(currentPage: number, itemsPerPage: number): void {
        this.state.actions.adminSchemas.setSchemaListPagination(currentPage, itemsPerPage);
    }

    setFilterTerm(term: string): void {
        this.state.actions.adminSchemas.setFilterTerm(term);
    }

    loadSchemas() {
        this.state.actions.adminSchemas.fetchSchemasStart();
        // TODO How to handle paging? Should all schemas be loaded?
        this.api.admin.getSchemas({}).subscribe(
            response => {
                this.state.actions.adminSchemas.fetchSchemasSuccess(response.data as Schema[]);
            },
            error => {
                this.state.actions.adminSchemas.fetchSchemasError();
            }
        );
    }

    newSchema(): void {
        this.state.actions.adminSchemas.newSchema();
    }

    openSchema(schemaUuid: string): Promise<Schema | void> {
        this.state.actions.adminSchemas.openSchemaStart();
        return this.api.admin
            .getSchema({ schemaUuid })
            .toPromise()
            .then(
                schema => {
                    this.state.actions.adminSchemas.openSchemaSuccess(schema);
                    return schema as Schema;
                },
                error => {
                    this.state.actions.adminSchemas.openSchemaError();
                }
            );
    }

    updateSchema(request: SchemaUpdateRequest & { uuid: string }) {
        this.state.actions.adminSchemas.updateSchemaStart();
        this.api.admin.updateSchema({ schemaUuid: request.uuid }, request).subscribe(
            response => {
                this.state.actions.adminSchemas.updateSchemaSuccess(response);
                this.i18nNotification.show({
                    type: 'success',
                    message: 'admin.schema_updated'
                });
            },
            error => {
                this.state.actions.adminSchemas.updateSchemaError();
                this.notification.show({
                    type: 'error',
                    message: error.toString()
                });
            }
        );
    }

    createSchema(request: SchemaCreateRequest): Promise<SchemaResponse | void> {
        this.state.actions.adminSchemas.createSchemaStart();
        return this.api.admin
            .createSchema({}, request)
            .toPromise()
            .then(
                schema => {
                    this.state.actions.adminSchemas.createSchemaSuccess(schema);
                    this.i18nNotification.show({
                        type: 'success',
                        message: 'admin.schema_created'
                    });
                },
                error => {
                    this.state.actions.adminSchemas.createSchemaError();
                    this.notification.show({
                        type: 'error',
                        message: error.toString()
                    });
                }
            );
    }

    deleteSchema(schemaUuid: string): Promise<void> {
        this.state.actions.adminSchemas.deleteSchemaStart();

        return this.api.admin
            .deleteSchema({ schemaUuid })
            .toPromise()
            .then(
                () => {
                    this.state.actions.adminSchemas.deleteSchemaSuccess(schemaUuid);
                    this.i18nNotification.show({
                        type: 'success',
                        message: 'admin.schema_deleted'
                    });
                },
                error => {
                    this.state.actions.adminSchemas.deleteSchemaError();
                    this.i18nNotification.show({
                        type: 'error',
                        message: error.toString()
                    });
                }
            );
    }

    loadMicroschemas(): void {
        this.state.actions.adminSchemas.fetchMicroschemasStart();
        this.api.admin.getMicroschemas({}).subscribe(
            microschemas => {
                this.state.actions.adminSchemas.fetchMicroschemasSuccess(microschemas.data);
            },
            error => {
                this.state.actions.adminSchemas.fetchMicroschemasError();
            }
        );
    }

    newMicroschema(): void {
        this.state.actions.adminSchemas.newMicroschema();
    }

    openMicroschema(microschemaUuid: string): Promise<Microschema | void> {
        this.state.actions.adminSchemas.openMicroschemaStart();
        return this.api.admin
            .getMicroschema({ microschemaUuid })
            .toPromise()
            .then(
                microschema => {
                    this.state.actions.adminSchemas.openMicroschemaSuccess(microschema);
                    return microschema as Microschema;
                },
                error => {
                    this.state.actions.adminSchemas.openMicroschemaError();
                    this.notification.show({
                        type: 'error',
                        message: error.toString()
                    });
                }
            );
    }

    updateMicroschema(request: MicroschemaUpdateRequest & { uuid: string }) {
        this.state.actions.adminSchemas.updateMicroschemaStart();
        this.api.admin
            .updateMicroschema({ microschemaUuid: request.uuid }, request)
            .flatMap(() => this.api.admin.getMicroschema({ microschemaUuid: request.uuid }))
            .subscribe(
                response => {
                    this.state.actions.adminSchemas.updateMicroschemaSuccess(response);
                    this.i18nNotification.show({
                        type: 'success',
                        message: 'admin.microschema_updated'
                    });
                },
                error => {
                    this.state.actions.adminSchemas.updateMicroschemaError();
                }
            );
    }

    createMicroschema(request: MicroschemaCreateRequest): Promise<MicroschemaResponse | void> {
        this.state.actions.adminSchemas.createMicroschemaStart();
        return this.api.admin
            .createMicroschema({}, request)
            .toPromise()
            .then(
                microschema => {
                    this.state.actions.adminSchemas.createMicroschemaSuccess(microschema);
                    this.i18nNotification.show({
                        type: 'success',
                        message: 'admin.microschema_created'
                    });
                },
                error => {
                    this.state.actions.adminSchemas.createMicroschemaError();
                    this.notification.show({
                        type: 'error',
                        message: error.toString()
                    });
                }
            );
    }

    deleteMicroschema(microschemaUuid: string): Promise<void> {
        this.state.actions.adminSchemas.deleteMicroschemaStart();

        return this.api.admin
            .deleteMicroschema({ microschemaUuid })
            .toPromise()
            .then(
                () => {
                    this.state.actions.adminSchemas.deleteMicroschemaSuccess(microschemaUuid);
                    this.i18nNotification.show({
                        type: 'success',
                        message: 'admin.microschema_deleted'
                    });
                },
                error => {
                    this.state.actions.adminSchemas.deleteMicroschemaError();
                    this.notification.show({
                        type: 'error',
                        message: error.toString()
                    });
                }
            );
    }

    /**
     * Loads the assignments of a schema/microschema to all projects.
     * @param type
     * @param uuid
     */
    loadEntityAssignments(type: 'microschema' | 'schema', uuid: string): Promise<ProjectAssignments> {
        const actions = this.state.actions.adminSchemas;
        actions.fetchEntityAssignmentsStart();

        const loadEntities = (project: ProjectResponse) =>
            type === 'schema'
                ? this.api.project.getProjectSchemas({ project: project.name })
                : this.api.project.getProjectMicroschemas({ project: project.name });

        // TODO consider paging
        // Get all projects
        return this.api.project
            .getProjects({})
            .flatMap(projects => {
                actions.fetchEntityAssignmentProjectsSuccess(projects.data);
                return Observable.from(projects.data);
            })
            .flatMap(project =>
                // TODO again, consider paging
                // Get all schemas/microschemas from the projects
                loadEntities(project).map(schemas => ({
                    [project.uuid]: schemas.data.some(schema => schema.uuid === uuid)
                }))
            )
            .reduce(merge)
            .defaultIfEmpty({})
            .toPromise()
            .then(assignments => {
                actions.fetchEntityAssignmentsSuccess(assignments);
                return assignments;
            })
            .catch(error => {
                actions.fetchEntityAssignmentsError();
                throw error;
            });
    }

    assignEntityToProject(type: 'schema' | 'microschema', entityUuid: string, projectName: string): void {
        let apiFunction: () => Observable<any>;
        if (type === 'schema') {
            apiFunction = () =>
                this.api.admin.assignSchemaToProject({ project: projectName, schemaUuid: entityUuid }, undefined);
        } else if (type === 'microschema') {
            apiFunction = () =>
                this.api.admin.assignMicroschemaToProject(
                    { project: projectName, microschemaUuid: entityUuid },
                    undefined
                );
        } else {
            throw new Error('type must be schema or microschema');
        }

        this.state.actions.adminSchemas.assignEntityToProjectStart();
        apiFunction().subscribe(
            () => {
                this.state.actions.adminSchemas.assignEntityToProjectSuccess();
            },
            error => {
                this.i18nNotification.show({
                    type: 'error',
                    message: error.toString()
                });
                this.state.actions.adminSchemas.assignEntityToProjectError();
            }
        );
    }

    removeEntityFromProject(type: 'schema' | 'microschema', entityUuid: string, projectName: string): void {
        let apiFunction: () => Observable<any>;
        if (type === 'schema') {
            apiFunction = () =>
                this.api.admin.removeSchemaFromProject({ project: projectName, schemaUuid: entityUuid });
        } else if (type === 'microschema') {
            apiFunction = () =>
                this.api.admin.removeMicroschemaFromProject({ project: projectName, microschemaUuid: entityUuid });
        } else {
            throw new Error('type must be schema or microschema');
        }

        this.state.actions.adminSchemas.removeEntityFromProjectStart();
        apiFunction().subscribe(
            () => {
                this.state.actions.adminSchemas.removeEntityFromProjectSuccess();
            },
            error => {
                this.i18nNotification.show({
                    type: 'error',
                    message: error.toString()
                });
                this.state.actions.adminSchemas.removeEntityFromProjectError();
            }
        );
    }
}

/**
 * Merges two objects. Useful as a reducer.
 */
function merge<T extends object, R extends object>(obj1: T, obj2: R): T & R {
    return Object.assign({}, obj1, obj2);
}
