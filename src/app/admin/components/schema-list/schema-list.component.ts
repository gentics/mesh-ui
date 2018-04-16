import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Schema } from '../../../common/models/schema.model';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    templateUrl: './schema-list.component.html',
    styleUrls: ['./schema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaListComponent implements OnInit {
    schemas$: Observable<Schema[]>;
    loading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private adminSchemaEffects: AdminSchemaEffectsService,
                private router: Router) {}

    ngOnInit(): void {
        this.schemas$ = this.entities.selectAllSchemas();
        this.loading$ = this.state.select(state => state.adminSchemas.loadCount > 0);
        this.adminSchemaEffects.loadSchemas();
    }

    createSchema() {
        this.router.navigate(['admin', 'schemas', 'new']);
    }
}
