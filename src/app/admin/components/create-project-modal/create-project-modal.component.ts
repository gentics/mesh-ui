import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { IModalDialog, Notification } from 'gentics-ui-core';

import { ProjectCreateRequest, ProjectResponse, SchemaResponse } from '../../../common/models/server-models';
import { ApiError } from '../../../core/providers/api/api-error';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';

@Component({
    selector: 'create-project-modal',
    templateUrl: './create-project-modal.component.html',
    styleUrls: ['./create-project-modal.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectModalComponent implements IModalDialog, OnInit {
    schemas$: Observable<SchemaResponse[]>;

    schema: FormControl;
    name: FormControl;
    form: FormGroup;

    creating = false;
    conflict = false;

    constructor(entities: EntitiesService,
                private notification: Notification,
                private adminSchemaEffects: AdminSchemaEffectsService,
                private adminProjectEffects: AdminProjectEffectsService) {

        this.schemas$ = entities.selectAllSchemas();
        this.name = new FormControl('', Validators.compose([Validators.required, this.conflictValidator]));
        this.schema = new FormControl('', Validators.required);

        this.form = new FormGroup({
            name: this.name,
            schema: this.schema
        });
    }

    ngOnInit(): void {
        this.adminSchemaEffects.loadSchemas();

        this.setDefaultSchema();
    }

    /** Set folder schema as default if it exists. (It will be chosen most of the time) */
    setDefaultSchema() {
        this.schemas$
        .skipWhile(schemas => schemas.length === 0)
        .take(1)
        .subscribe(schemas => {
            const folderSchema = schemas.find(schema => schema.name === 'folder');
            if (folderSchema) {
                this.schema.setValue(folderSchema);
            }
        });
    }

    closeFn = (val: ProjectResponse) => {};
    cancelFn = (val?: any) => {};

    registerCloseFn(close: (val: ProjectResponse) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val?: any) => void): void {
        this.cancelFn = cancel;
    }

    createProject() {
        if (this.form.valid) {
            const request: ProjectCreateRequest = {
                name: this.name.value,
                schema: {
                    uuid: this.schema.value.uuid,
                    name: this.schema.value.name,
                    // TODO: this is required per the generated models, but not needed per the Mesh docs.
                    version: this.schema.value.version
                }
            };

            this.form.markAsPristine();
            this.creating = true;
            this.conflict = false;
            this.adminProjectEffects.createProject(request).then(response => {
                this.closeFn(response);
                this.creating = false;
            }).catch(err => {
                if (err instanceof ApiError && err.response && err.response.status === 409) {
                    this.conflict = true;
                    this.name.updateValueAndValidity();
                } else {
                    this.notification.show({
                        type: 'error',
                        message: err.toString()
                    });
                }
                this.creating = false;
            });
        }
    }

    private conflictValidator: (control: AbstractControl) => ValidationErrors | null = control => {
        if (control.pristine && this.conflict) {
            return {conflict: true};
        } else {
            return null;
        }
    }
}
