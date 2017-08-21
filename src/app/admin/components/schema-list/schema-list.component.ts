import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { hashValues } from '../../../common/util/util';
import { Schema } from '../../../common/models/schema.model';
import { SchemaEffectsService } from '../../../core/providers/effects/schema-effects.service';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    templateUrl: './schema-list.component.html',
    styleUrls: ['./schema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaListComponent {
    schemas$: Observable<Schema[]>;
    loading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private schemaEffects: SchemaEffectsService,
                private router: Router) {
        this.schemas$ = entities.selectAllSchemas();
        this.loading$ = state.select(state => state.admin.loadCount > 0);
        this.schemaEffects.loadSchemas();
    }

    createSchema() {
        this.router.navigate(['admin', 'schemas', 'new']);
    }
}
