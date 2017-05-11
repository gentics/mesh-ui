import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';

@Injectable()
export class UserEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
    }

    changePassword(userUuid: string, password: string) {
        this.state.actions.admin.changePasswordStart();
        this.api.admin.updateUser({ userUuid }, { password })
            .subscribe(user => {
                this.state.actions.admin.changePasswordEnd();
            }, error => {
                // TODO Provide some error message or toast and add some generic error handler
            });
    }
}
