import { Injectable } from '@angular/core';
import { Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { MicroschemaUpdateRequest, MicroschemaCreateRequest, MicroschemaResponse } from '../../../common/models/server-models';

@Injectable()
export class MicroschemaEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService,
                private i18nNotification: I18nNotification,
                private notification: Notification) {
    }

    loadMicroschemas() {
        this.state.actions.list.fetchMicroschemasStart();
        this.api.admin.getMicroschemas({})
        .subscribe(microschemas => {
            this.state.actions.list.fetchMicroschemasSuccess(microschemas.data);
        }, error => {
            this.state.actions.list.fetchMicroschemasError();
        });
    }

    loadMicroschema(microschemaUuid: string) {
        this.state.actions.list.fetchMicroschemaStart();
        this.api.admin.getMicroschema({microschemaUuid})
        .subscribe(microschema => {
            this.state.actions.list.fetchMicroschemaSuccess(microschema);
        }, error => {
            this.state.actions.list.fetchMicroschemaError();
        });
    }

    openMicroschema(microschemaUuid: string) {
        this.state.actions.admin.openMicroschemaStart();
        this.api.admin.getMicroschema({microschemaUuid})
        .subscribe(microschema => {
            this.state.actions.admin.openMicroschemaSuccess(microschema);
        }, error => {
            this.state.actions.admin.openMicroschemaError();
            this.notification.show({
                type: 'error',
                message: error.toString()
            });
        });
    }

    updateMicroschema(request: MicroschemaUpdateRequest & {uuid: string}) {
        this.state.actions.admin.actionStart();
        this.api.admin.updateMicroschema({microschemaUuid: request.uuid}, request)
        .subscribe(() => {
            this.loadMicroschema(request.uuid);
            this.state.actions.admin.actionSuccess();
            this.i18nNotification.show({
                type: 'success',
                message: 'admin.microschema_updated'
            });
        }, error => {
            this.state.actions.admin.actionError();
        });
    }

    createMicroschema(request: MicroschemaCreateRequest): Observable<MicroschemaResponse> {
        const subject = new Subject<MicroschemaResponse>();

        this.state.actions.admin.actionStart();
        this.api.admin.createMicroschema({}, request)
        .subscribe(microschema => {
            this.state.actions.admin.createMicroschemaSuccess(microschema);
            this.i18nNotification.show({
                type: 'success',
                message: 'admin.microschema_created'
            });
            subject.next(microschema);
            subject.complete();
        }, error => {
            this.state.actions.admin.actionError();
            this.notification.show({
                type: 'error',
                message: error.toString()
            });
            subject.error(error);
        });

        return subject.asObservable();
    }

    deleteMicroschema(microschemaUuid: string): Observable<void> {
        const subject = new Subject<void>();
        this.state.actions.admin.actionStart();

        this.api.admin.deleteMicroschema({microschemaUuid})
        .subscribe(() => {
            this.state.actions.admin.deleteMicroschemaSuccess(microschemaUuid);
            this.i18nNotification.show({
                type: 'success',
                message: 'admin.microschema_deleted'
            });
            subject.next();
            subject.complete();
        }, error => {
            this.state.actions.admin.actionError();
            this.i18nNotification.show({
                type: 'error',
                message: 'admin.microschema_deleted_error'
            });
            subject.error(error);
        });

        return subject.asObservable();
    }
}
