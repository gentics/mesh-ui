import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Microschema } from '../../../common/models/microschema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ModalService } from 'gentics-ui-core';
import { hashValues } from '../../../common/util/util';
import { MicroschemaEffectsService } from '../../providers/effects/microschema-effects.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './microschema-list.component.html',
    styleUrls: ['./microschema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaListComponent {
    microschemas$: Observable<Microschema[]>;
    loading$: Observable<boolean>;

    constructor(private state: ApplicationStateService,
                private modal: ModalService,
                private microschemaEffects: MicroschemaEffectsService,
                private router: Router) {
        this.microschemas$ = state.select(state => state.entities.microschema)
            .map(hashValues);

        this.loading$ = state.select(state => state.list.loadCount > 0);
        this.microschemaEffects.loadMicroschemas();
    }

    createMicroschema() {
        this.router.navigate(['admin', 'microschemas', 'new']);
    }
}
