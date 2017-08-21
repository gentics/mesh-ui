import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalService } from 'gentics-ui-core';
import { MicroschemaEffectsService } from '../../providers/effects/microschema-effects.service';
import { MicroschemaResponse, MicroschemaUpdateRequest } from '../../../common/models/server-models';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    templateUrl: './microschema.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaComponent implements OnInit {
    microschema$: Observable<MicroschemaResponse>;

    microschemaJson: string;
    // TODO load json schema from mesh instead of static file
    schema = require('./microschema.schema.json');

    constructor(private entities: EntitiesService,
                private modal: ModalService,
                private microschemaEffects: MicroschemaEffectsService,
                private route: ActivatedRoute,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        const uuid$ = this.route.paramMap
        .map(map => map.get('uuid'))
        .distinctUntilChanged();

        this.microschema$ = uuid$
            .switchMap(uuid => {
                if (uuid) {
                    return this.entities.selectSchema(uuid);
                } else {
                    // TODO handle this?
                    throw Error('uuid not set');
                }
            }
        );

        uuid$.filter(Boolean).take(1).subscribe(uuid => {
            // TODO handle 404 or other errors
            this.microschemaEffects.loadMicroschema(uuid);
        });

        this.microschema$
        .filter(Boolean)
        .take(1)
        .subscribe(microschema => {
            const val = JSON.stringify(stripMicroschemaFields(microschema), undefined, 2);
            this.microschemaJson = val;
            this.ref.detectChanges();
        });
    }
}

const updateFields = ['name', 'description', 'fields'];

function stripMicroschemaFields(microschema: MicroschemaResponse): MicroschemaUpdateRequest {
    return updateFields.reduce((obj, key) => ({...obj, [key]: microschema[key]}), {});
}
