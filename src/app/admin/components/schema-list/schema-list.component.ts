import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { hashValues } from '../../../common/util/util';
import { Schema } from '../../../common/models/schema.model';
import { SchemaEffectsService } from '../../../core/providers/effects/schema-effects.service';

@Component({
    templateUrl: './schema-list.component.html',
    styleUrls: ['./schema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaListComponent {
    schemas$: Observable<Schema[]>;
    loading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private schemaEffects: SchemaEffectsService,
                private router: Router) {
        this.schemas$ = state.select(state => state.admin.displayedSchemas)
            .map(uuids => uuids.map(uuid => state.now.entities.schema[uuid]));

        this.loading$ = state.select(state => state.admin.loadCount > 0);
        this.schemaEffects.loadSchemas();
    }

    createSchema() {
        this.router.navigate(['admin', 'schemas', 'new']);
    }
}
