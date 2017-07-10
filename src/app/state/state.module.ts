import { NgModule } from '@angular/core';
import { ApplicationStateService } from './providers/application-state.service';
import { ApplicationStateDevtools } from './providers/application-state-devtools';

@NgModule({
    providers: [ApplicationStateService, ApplicationStateDevtools],
})
export class StateModule {
}
