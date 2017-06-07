import { NgModule } from '@angular/core';
import { ApplicationStateService } from './providers/application-state.service';

@NgModule({
    providers: [ApplicationStateService]
})
export class StateModule {
}
