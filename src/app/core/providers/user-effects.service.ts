import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';

@Injectable()
export class UserEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
    }

    changePassword(userUuid: string, password: string): Promise<void> {
        this.state.actions.admin.changePasswordStart();
        return this.api.admin.updateUser({ userUuid }, { password })
            .toPromise()
            .then(user => {
                this.state.actions.admin.changePasswordEnd();
            });
            // TODO Provide some error message or toast and add some generic error handler
    }
}
