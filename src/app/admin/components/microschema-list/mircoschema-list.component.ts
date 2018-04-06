import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Microschema } from '../../../common/models/microschema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ModalService } from 'gentics-ui-core';
import { MicroschemaEffectsService } from '../../providers/effects/microschema-effects.service';
import { Router } from '@angular/router';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    templateUrl: './microschema-list.component.html',
    styleUrls: ['./microschema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaListComponent {
    microschemas$: Observable<Microschema[]>;
    loading$: Observable<boolean>;

    constructor(entities: EntitiesService,
                private microschemaEffects: MicroschemaEffectsService,
                private state: ApplicationStateService,
                private router: Router) {
        this.microschemas$ = entities.selectAllMicroschemas();
        this.loading$ = state.select(s => s.list.loadCount > 0);
        this.microschemaEffects.loadMicroschemas();
    }

    createMicroschema() {
        this.router.navigate(['admin', 'microschemas', 'new']);
    }
}
