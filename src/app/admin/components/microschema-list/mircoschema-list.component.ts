import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Microschema } from '../../../common/models/microschema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    templateUrl: './microschema-list.component.html',
    styleUrls: ['./microschema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaListComponent implements OnInit {
    microschemas$: Observable<Microschema[]>;

    constructor(private entities: EntitiesService,
                private adminSchemaEffects: AdminSchemaEffectsService,
                private state: ApplicationStateService,
                private router: Router) {}

    ngOnInit(): void {
        this.microschemas$ = this.entities.selectAllMicroschemas();
        this.adminSchemaEffects.loadMicroschemas();
    }

    createMicroschema() {
        this.router.navigate(['admin', 'microschemas', 'new']);
    }
}
