import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalService } from 'gentics-ui-core';

import { MicroschemaResponse } from '../../../common/models/server-models';
import { MarkerData } from '../monaco-editor/monaco-editor.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    templateUrl: './microschema-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaDetailComponent implements OnInit, OnDestroy {
    // TODO Disable save button when editor is pristine
    // TODO Show message on save when schema has not changed
    microschema$: Observable<MicroschemaResponse>;
    version$: Observable<string>;

    uuid$: Observable<string>;

    microschemaJson = '';
    // TODO load json schema from mesh instead of static file
    schema = require('./microschema.schema.json');

    errors: MarkerData[] = [];
    isNew = true;

    loading$: Observable<boolean>;

    subscription: Subscription;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private modal: ModalService,
                private adminSchemaEffects: AdminSchemaEffectsService,
                private route: ActivatedRoute,
                private router: Router,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.microschema$ = this.route.data
            .map(data => data.microschema)
            .do(microschema => { this.isNew = !microschema; });

        this.version$ = this.microschema$.map(it => it.version);

        this.subscription = this.microschema$
        .subscribe(microschema => {
            this.microschemaJson = microschema ? JSON.stringify(stripMicroschemaFields(microschema), undefined, 4) : `{}`;
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
            const changedSchema = JSON.parse(this.microschemaJson);
            if (this.isNew) {
                this.adminSchemaEffects.createMicroschema(changedSchema).then(microschema => {
                    if (microschema) {
                        this.router.navigate(['admin', 'microschemas', microschema.uuid]);
                    }
                });
            } else {
                this.microschema$.take(1).subscribe(microschema => {
                    this.adminSchemaEffects.updateMicroschema({...microschema, ...changedSchema});
                });
            }
        }
    }

    delete() {
        this.microschema$.take(1)
        .switchMap(microschema => this.adminSchemaEffects.deleteMicroschema(microschema.uuid))
        .subscribe(() => this.router.navigate(['admin', 'microschemas']));
    }
}

const updateFields: Array<keyof MicroschemaResponse> = ['name', 'description', 'fields'];

function stripMicroschemaFields(microschema: MicroschemaResponse): any {
    return updateFields.reduce((obj, key) => ({...obj, [key]: microschema[key]}), {});
}
