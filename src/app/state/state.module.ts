import { NgModule } from '@angular/core';
import { ApplicationStateService } from './providers/application-state.service';
import { ApplicationStateDevtools } from './providers/application-state-devtools';
import { EntitiesService } from './providers/entities.service';

@NgModule({
    providers: [ApplicationStateService, EntitiesService, ApplicationStateDevtools],
})
export class StateModule {
}
