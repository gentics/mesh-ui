import { NgModule } from '@angular/core';

import { ApplicationStateDevtools } from './providers/application-state-devtools';
import { ApplicationStateService } from './providers/application-state.service';
import { EntitiesService } from './providers/entities.service';

@NgModule({
    providers: [ApplicationStateService, EntitiesService, ApplicationStateDevtools]
})
export class StateModule {}
