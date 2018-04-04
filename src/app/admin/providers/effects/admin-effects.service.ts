import { Injectable } from '@angular/core';
import { Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/providers/api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ProjectResponse } from '../../../common/models/server-models';

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

        const loadEntities = (project: ProjectResponse) => type === 'schema' ?
            this.api.project.getProjectSchemas({project: project.name}) :
            this.api.project.getProjectMicroschemas({project: project.name});

        // TODO consider paging
        // Get all projects
        this.api.project.getProjects({}).flatMap(projects => {
            actions.loadEntityAssignmentProjectsSuccess(projects.data);
            return Observable.from(projects.data);
        })
        .flatMap(project =>
            // TODO again, consider paging
            // Get all schemas/microschemas from the projects
            loadEntities(project)
                .map(schemas => ({
                    [project.uuid]: schemas.data.some(schema => schema.uuid === uuid)
                }))
        )
        .reduce(merge)
        .defaultIfEmpty({})
        .subscribe(
            assignments => actions.loadEntityAssignmentsSuccess(assignments),
            error => actions.loadEntityAssignmentsError()
        );
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

/**
 * Merges two objects. Useful as a reducer.
 */
function merge<T extends object, R extends object>(obj1: T, obj2: R): T & R {
    return Object.assign({}, obj1, obj2);
}
