import { Component } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { Schema } from '../../../../../../common/models/schema.model';
import { ApplicationStateService } from '../../../../../../state/providers/application-state.service';
import { hashValues } from '../../../../../../util';

@Component({
    templateUrl: './create-project-modal.component.html'
})
export class CreateProjectModalComponent implements IModalDialog {

    schemas$: Observable<Schema>;

    constructor(state: ApplicationStateService) {

    }

    closeFn = () => {};
    cancelFn = () => {};

    registerCloseFn(close: () => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: () => void): void {
        this.cancelFn = cancel;
    }
}
