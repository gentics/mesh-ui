import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Microschema } from '../../../common/models/microschema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ModalService } from 'gentics-ui-core';
import { hashValues, filenameExtension } from '../../../common/util/util';
import { MicroschemaEffectsService } from '../../providers/effects/microschema-effects.service';
import { MicroschemaResponse, MicroschemaUpdateRequest } from '../../../common/models/server-models';
import { MarkerData } from '../monaco-editor/monaco-editor.component';

@Component({
    templateUrl: './microschema.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaComponent implements OnInit {
    // TODO Disable save button when editor is pristine
    // TODO Show message on save when schema has not changed
    microschema$: Observable<MicroschemaResponse>;
    version$: Observable<string>;

    microschemaJson: string = '';
    // TODO load json schema from mesh instead of static file
    schema = require('./microschema.schema.json');

    errors: MarkerData[] = [];
    isNew = true;

    loading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private modal: ModalService,
                private microschemaEffects: MicroschemaEffectsService,
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
            })
            // This will cause all the stuff below to not trigger when a new microschema is made.
            .filter(route => route !== 'new');

        this.microschema$ = uuid$
            .switchMap(uuid => {
                return this.state.select(state => state.entities.microschema[uuid!]);
            }
        ).filter(Boolean);

        this.version$ = this.microschema$.map(it => it.version);

        uuid$.filter(Boolean).take(1).filter(route => route !== 'new').subscribe(uuid => {
            // TODO handle 404 or other errors
            this.microschemaEffects.loadMicroschema(uuid);
        });

        this.microschema$
        .take(1)
        .subscribe(microschema => {
            const val = JSON.stringify(stripMicroschemaFields(microschema), undefined, 4);
            this.microschemaJson = val;
            this.ref.detectChanges();
        });
    }

    onErrorChange(errors: MarkerData[]) {
        this.errors = errors;
        this.ref.detectChanges();
    }

    save() {
        if (this.errors.length === 0) {
            const changedSchema = JSON.parse(this.microschemaJson);
            if (this.isNew) {
                this.microschemaEffects.createMicroschema(changedSchema).subscribe(microschema => {
                    this.router.navigate(['admin', 'microschemas', microschema.uuid]);
                });
            } else {
                this.microschema$.take(1).subscribe(microschema => {
                    this.microschemaEffects.updateMicroschema({...microschema, ...changedSchema});
                });
            }
        }
    }

    delete() {
        this.microschema$.take(1)
        .switchMap(microschema => this.microschemaEffects.deleteMicroschema(microschema.uuid))
        .subscribe(() => this.router.navigate(['admin', 'microschemas']));
    }
}

const updateFields = ['name', 'description', 'fields'];

function stripMicroschemaFields(microschema: MicroschemaResponse): any {
    return updateFields.reduce((obj, key) => ({...obj, [key]: microschema[key]}), {});
}
