import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { MarkerData } from '../monaco-editor/monaco-editor.component';
import { SchemaResponse } from '../../../common/models/server-models';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    templateUrl: './schema-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaDetailComponent implements OnInit, OnDestroy {
    // TODO Disable save button when editor is pristine
    // TODO Show message on save when schema has not changed
    schema$: Observable<SchemaResponse>;
    version$: Observable<string>;
    uuid$: Observable<string>;
    schemaJson = '';
    // TODO load json schema from mesh instead of static file
    schema = require('./schema.schema.json');
    errors: MarkerData[] = [];
    isNew = true;
    private subscription: Subscription;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private modal: ModalService,
                private schemaEffects: AdminSchemaEffectsService,
                private route: ActivatedRoute,
                private router: Router,
                private ref: ChangeDetectorRef) {}

    ngOnInit() {
        this.schema$ = this.route.data
            .map(data => data.schema)
            .do(schema => { this.isNew = !schema; });

        this.version$ = this.schema$.map(it => it.version);

        this.subscription = this.schema$
            .subscribe(schema => {
                this.schemaJson = schema ? JSON.stringify(stripSchemaFields(schema), undefined, 4) : `{}`;
                this.ref.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onErrorChange(errors: MarkerData[]) {
        this.errors = errors;
        this.ref.detectChanges();
    }

    save() {
        if (this.errors.length === 0) {
            const changedSchema = JSON.parse(this.schemaJson);
            if (this.isNew) {
                this.schemaEffects.createSchema(changedSchema).then(schema => {
                    if (schema) {
                        this.router.navigate(['admin', 'schemas', schema.uuid]);
                    }
                });
            } else {
                this.schema$.take(1).subscribe(schema => {
                    this.schemaEffects.updateSchema({...schema, ...changedSchema});
                });
            }
        }
    }

    delete() {
        this.schema$.take(1)
        .switchMap(schema => this.schemaEffects.deleteSchema(schema.uuid))
        .subscribe(() => this.router.navigate(['admin', 'schemas']));
    }
}

const updateFields = ['name', 'description', 'fields'];

function stripSchemaFields(schema: SchemaResponse): any {
    return updateFields.reduce((obj, key) => ({...obj, [key]: schema[key]}), {});
}
