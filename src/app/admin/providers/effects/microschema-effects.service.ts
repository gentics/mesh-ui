import { Injectable } from '@angular/core';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';


@Injectable()
export class MicroschemaEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
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
}
