import { Component } from '@angular/core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../providers/navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
    selector: 'user-dropdown',
    templateUrl: './user-dropdown.component.html'
})
export class UserDropdownComponent {

    constructor(private state: ApplicationStateService,
                private router: Router) {

    }

    logOut(): void {
        // TODO: actually log out
        this.state.actions.auth.logoutStart();
        this.state.actions.auth.logoutSuccess();

        this.router.navigate(['/login']);
    }
}
