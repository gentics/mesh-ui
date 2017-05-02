import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../providers/navigation/navigation.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationElementFromServer } from '../../../common/models/server-models';
import { User } from '../../../common/models/user.model';

@Component({
    selector: 'user-dropdown',
    templateUrl: './user-dropdown.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDropdownComponent {
    currentUsername$: Observable<string>;

    constructor(private state: ApplicationStateService,
                private router: Router) {
        this.currentUsername$ = state.select(state => state.entities.user[state.auth.currentUser])
            .map(this.toUserName)
            .distinctUntilChanged();
    }

    logOut(): void {
        // TODO: actually log out
        this.state.actions.auth.logoutStart();
        this.state.actions.auth.logoutSuccess();

        this.router.navigate(['/login']);
    }

    changePassword(): void {
        this.router.navigate(['/changepassword']);
    }

    /**
     * Transforms a user object into its username.
     * This is needed because the first name and last name properties are optional.
     * @param user The user to extract the user name from
     */
    private toUserName(user: User): string {
        if (user.firstname && user.lastname) {
            return `${user.firstname} ${user.lastname}`;
        } else {
            return user.username;
        }
    }
}
