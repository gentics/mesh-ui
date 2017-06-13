import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IModalDialog, Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { hashValues } from '../../../common/util/util';
import { SchemaResponse } from '../../../common/models/server-models';
import { SchemaEffectsService } from '../../../core/providers/effects/schema-effects.service';

@Component({
    templateUrl: './create-project-modal.component.html',
    styleUrls: ['./create-project-modal.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectModalComponent implements IModalDialog, OnInit {
    schemas$: Observable<SchemaResponse[]>;

    schema: FormControl;
    name: FormControl;

    form: FormGroup;

    constructor(state: ApplicationStateService,
                private notification: Notification,
                private schemaEffects: SchemaEffectsService) {
        this.schemas$ = state.select(state => state.entities.schema)
            .map(hashValues);

        this.name = new FormControl('', Validators.required);
        this.schema = new FormControl('', Validators.required);

        this.form = new FormGroup({
            name: this.name,
            schema: this.schema
        });
    }

    ngOnInit(): void {
        this.schemaEffects.loadSchemas();
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
