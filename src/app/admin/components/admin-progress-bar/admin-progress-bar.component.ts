import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    template: `<gtx-progress-bar [for]="loading$"></gtx-progress-bar>`,
    selector: 'admin-progress-bar'
})
export class AdminProgressBarComponent {
    loading$: Observable<boolean>;

    constructor(private state: ApplicationStateService) {
        this.loading$ = state.select(state => state.admin.loadCount > 0);
    }
}
