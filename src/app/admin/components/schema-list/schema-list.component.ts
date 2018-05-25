import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Schema } from '../../../common/models/schema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    templateUrl: './schema-list.component.html',
    styleUrls: ['./schema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaListComponent implements OnInit {
    schemas$: Observable<Schema[]>;

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.schemas$ = this.entities.selectAllSchemas();
        this.adminSchemaEffects.loadSchemas();
    }

    createSchema() {
        this.router.navigate(['admin', 'schemas', 'new']);
    }
}
