import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ModalService } from 'gentics-ui-core';
import { hashValues, filenameExtension } from '../../../common/util/util';
import { MarkerData } from '../monaco-editor/monaco-editor.component';
import { SchemaResponse } from '../../../common/models/server-models';
import { SchemaEffectsService } from '../../../core/providers/effects/schema-effects.service';

@Component({
    templateUrl: './schema.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaComponent implements OnInit, OnDestroy {
    // TODO Disable save button when editor is pristine
    // TODO Show message on save when schema has not changed
    schema$: Observable<SchemaResponse>;
    version$: Observable<string>;

    schemaJson: string = '';
    // TODO load json schema from mesh instead of static file
    schema = require('./schema.schema.json');

    errors: MarkerData[] = [];
    isNew = true;

    loading$: Observable<boolean>;

    subscription: Subscription;

    constructor(private state: ApplicationStateService,
                private modal: ModalService,
                private schemaEffects: SchemaEffectsService,
                private route: ActivatedRoute,
                private router: Router,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.loading$ = this.state.select(state => state.admin.loadCount > 0);

        const uuid$ = this.route.paramMap
            .map(map => map.get('uuid'))
            .distinctUntilChanged()
            .do(route => {
                this.isNew = route === 'new';
                if (this.isNew) {
                    this.state.actions.admin.newMicroschema();
                }
            })
            // This will cause all the stuff below to not trigger when a new schema is made.
            .filter(route => route !== 'new');

        this.schema$ = uuid$
            .switchMap(uuid => {
                return this.state.select(state => state.entities.schema[uuid!]);
            }
        ).filter(Boolean);

        this.version$ = this.schema$.map(it => it.version);

        uuid$.filter(Boolean).take(1).filter(route => route !== 'new').subscribe(uuid => {
            // TODO handle 404 or other errors
            this.schemaEffects.openSchema(uuid);
        });

        this.subscription = this.schema$
        .subscribe(schema => {
            const val = JSON.stringify(stripSchemaFields(schema), undefined, 4);
            this.schemaJson = val;
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
                this.schemaEffects.createSchema(changedSchema).subscribe(schema => {
                    this.router.navigate(['admin', 'schemas', schema.uuid]);
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
