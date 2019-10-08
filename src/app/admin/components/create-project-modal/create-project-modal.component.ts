import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { IModalDialog, Notification } from 'gentics-ui-core';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { ProjectCreateRequest, ProjectResponse, SchemaResponse } from '../../../common/models/server-models';
import { ApiError } from '../../../core/providers/api/api-error';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminPermissionEffectsService } from '../../providers/effects/admin-permission-effects.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { AdminRoleEffectsService } from '../../providers/effects/admin-role-effects.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    selector: 'mesh-create-project-modal',
    templateUrl: './create-project-modal.component.html',
    styleUrls: ['./create-project-modal.scss']
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectModalComponent implements IModalDialog, OnInit {
    schemas$: Observable<SchemaResponse[]>;

    schema: FormControl;
    name: FormControl;
    projectName: string;
    anonymousAccess: FormControl;
    form: FormGroup;

    creating = false;
    conflict = false;

    constructor(
        entities: EntitiesService,
        private notification: Notification,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private adminProjectEffects: AdminProjectEffectsService,
        private adminRoleEffects: AdminRoleEffectsService,
        private adminPermissionEffects: AdminPermissionEffectsService
    ) {
        this.schemas$ = entities.selectAllSchemas();
        this.name = new FormControl('', Validators.compose([Validators.required, this.conflictValidator]));
        this.schema = new FormControl('', Validators.required);
        this.anonymousAccess = new FormControl(true);

        this.form = new FormGroup({
            name: this.name,
            schema: this.schema,
            anonymousAccess: this.anonymousAccess
        });
    }

    ngOnInit(): void {
        this.adminSchemaEffects.loadSchemas();

        this.setDefaultSchema();
        this.name.setValue(this.projectName);
    }

    /** Set folder schema as default if it exists. (It will be chosen most of the time) */
    setDefaultSchema() {
        this.schemas$
            .pipe(
                skipWhile(schemas => schemas.length === 0),
                take(1)
            )
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

    async createProject() {
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
            try {
                const response = await this.adminProjectEffects.createProject(request);
                if (this.anonymousAccess.value) {
                    // Required by https://github.com/gentics/mesh-ui/issues/42
                    const uuid = await this.adminRoleEffects.loadAnonymousRoleUuid();
                    this.adminPermissionEffects.grantPermissionToProject(uuid, response.uuid, {
                        permissions: { read: true },
                        recursive: true
                    });
                }
                this.closeFn(response);
                this.creating = false;
            } catch (err) {
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
            }
        }
    }

    private conflictValidator: (control: AbstractControl) => ValidationErrors | null = control => {
        if (control.pristine && this.conflict) {
            return { conflict: true };
        } else {
            return null;
        }
    };
}
