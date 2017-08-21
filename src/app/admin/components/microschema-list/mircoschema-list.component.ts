import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Microschema } from '../../../common/models/microschema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ModalService } from 'gentics-ui-core';
import { MicroschemaEffectsService } from '../../providers/effects/microschema-effects.service';
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
                private state: ApplicationStateService,
                private modal: ModalService,
                private microschemaEffects: MicroschemaEffectsService) {

        this.microschemas$ = entities.selectAllMicroschemas();
        this.loading$ = state.select(state => state.list.loadCount > 0);
        this.microschemaEffects.loadMicroschemas();
    }
}
