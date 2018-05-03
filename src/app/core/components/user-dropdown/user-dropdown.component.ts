import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { User } from '../../../common/models/user.model';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { UserResponse } from '../../../common/models/server-models';
import { AuthEffectsService } from '../../../login/providers/auth-effects.service';

@Component({
    selector: 'mesh-user-dropdown',
    templateUrl: './user-dropdown.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDropdownComponent implements OnInit {
    currentUsername$: Observable<string>;

    constructor(private state: ApplicationStateService,
                private modal: ModalService,
                private authEffects: AuthEffectsService) {}

    ngOnInit(): void {
        this.currentUsername$ = this.state.select(state => state.auth.currentUser)
            // Filter so that nothing emits if no user is logged in
            .filter(user => !!user)
            .switchMap((userUuid: string) => this.state.select(state => state.entities.user[userUuid]))
            .map(this.toUserName)
            .distinctUntilChanged();
    }

    logOut(): void {
        this.authEffects.logout();
    }

    changePassword(): void {
        this.modal.fromComponent(ChangePasswordModalComponent)
            .then(modal => modal.open());
    }

    /**
     * Transforms a user object into its username.
     * This is needed because the first name and last name properties are optional.
     * @param user The user to extract the user name from
     */
    private toUserName(user: UserResponse): string {
        if (user.firstname && user.lastname) {
            return `${user.firstname} ${user.lastname}`;
        } else {
            return user.username;
        }
    }
}
