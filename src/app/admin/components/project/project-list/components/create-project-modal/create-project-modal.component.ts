import { Component } from '@angular/core';
import { IModalDialog, Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { Schema } from '../../../../../../common/models/schema.model';
import { ApplicationStateService } from '../../../../../../state/providers/application-state.service';
import { hashValues } from '../../../../../../util';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './create-project-modal.component.html',
    styleUrls: ['./create-project-modal.scss']
})
export class CreateProjectModalComponent implements IModalDialog {
    schemas$: Observable<Schema[]>;

    schema: FormControl;
    name: FormControl;

    form: FormGroup;

    constructor(state: ApplicationStateService,
                private notification: Notification) {
        this.schemas$ = state.select(state => state.entities.schema)
            .map(hashValues);

        this.name = new FormControl('', Validators.required);
        this.schema = new FormControl('', Validators.required);

        this.form = new FormGroup({
            name: this.name,
            schema: this.schema
        });
    }

    closeFn = () => {};
    cancelFn = () => {};

    registerCloseFn(close: () => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: () => void): void {
        this.cancelFn = cancel;
    }

    createProject() {
        if (this.form.valid) {
            // TODO Actually create project
            this.notification.show({type: 'success', message: 'created'});
            this.closeFn();
        }
    }
}
