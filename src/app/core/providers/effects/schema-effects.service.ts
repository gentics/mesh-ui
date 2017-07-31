import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { SchemaUpdateRequest, SchemaResponse, SchemaCreateRequest } from '../../../common/models/server-models';
import { I18nNotification } from '../i18n-notification/i18n-notification.service';

@Injectable()
export class SchemaEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService,
                private notification: I18nNotification) {
    }

    loadSchemas() {
        this.state.actions.admin.actionStart();
        // TODO How to handle paging? Should all schemas be loaded?
        this.api.schema.getSchemas({})
            .subscribe(schemas => {
                this.state.actions.admin.loadSchemasSuccess(schemas.data);
            }, error => {
                this.state.actions.admin.actionError();
            });
    }

    loadSchema(schemaUuid: string) {
        this.state.actions.list.fetchSchemaStart();
        this.api.schema.getSchema({schemaUuid})
        .subscribe(schema => {
            this.state.actions.list.fetchSchemaSuccess(schema);
        }, error => {
            this.state.actions.list.fetchSchemaError();
        });
    }

    openSchema(schemaUuid: string) {
        this.state.actions.admin.openSchemaStart();
        this.api.schema.getSchema({schemaUuid})
        .subscribe(schema => {
            this.state.actions.admin.openSchemaSuccess(schema);
        }, error => {
            this.state.actions.admin.openSchemaError();
        });
    }

    updateSchema(request: SchemaUpdateRequest & {uuid: string}) {
        this.state.actions.admin.actionStart();
        this.api.admin.updateSchema({schemaUuid: request.uuid}, request)
        .subscribe(() => {
            this.loadSchema(request.uuid);
            this.state.actions.admin.actionSuccess();
            this.notification.show({
                type: 'success',
                message: 'admin.schema_updated'
            });
        }, error => {
            this.state.actions.admin.actionError();
        });
    }

    createSchema(request: SchemaCreateRequest): Observable<SchemaResponse> {
        const subject = new Subject<SchemaResponse>();

        this.state.actions.admin.actionStart();
        this.api.admin.createSchema({}, request)
        .subscribe(schema => {
            this.state.actions.admin.createSchemaSuccess(schema);
            this.notification.show({
                type: 'success',
                message: 'admin.schema_created'
            });
            subject.next(schema);
            subject.complete();
        }, error => {
            this.state.actions.admin.actionError();
            subject.error(error);
        });

        return subject.asObservable();
    }

    deleteSchema(schemaUuid: string): Observable<void> {
        const subject = new Subject<void>();
        this.state.actions.admin.actionStart();

        this.api.admin.deleteSchema({schemaUuid})
        .subscribe(() => {
            this.state.actions.admin.deleteSchemaSuccess(schemaUuid);
            this.notification.show({
                type: 'success',
                message: 'admin.schema_deleted'
            });
            subject.next();
            subject.complete();
        }, error => {
            this.state.actions.admin.actionError();
            this.notification.show({
                type: 'error',
                message: 'admin.schema_deleted_error'
            });
            subject.error(error);
        });

        return subject.asObservable();
    }
}
