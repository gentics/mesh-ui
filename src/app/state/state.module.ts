import { NgModule } from '@angular/core';
import { ApplicationStateService } from './providers/application-state.service';
import { ApplicationStateDevtools } from './providers/application-state-devtools';
import { EntitySelectService } from './providers/entity-select.service';

@NgModule({
    providers: [ApplicationStateService, EntitySelectService, ApplicationStateDevtools],
})
export class StateModule {
}
