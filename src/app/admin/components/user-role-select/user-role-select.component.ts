import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';

import { Role } from '../../../common/models/role.model';
import { RoleReferenceFromServer } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-user-role-select',
    templateUrl: './user-role-select.component.html',
    styleUrls: ['./user-role-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRoleSelectComponent implements OnChanges {
    /** Available roles to display in the dropdown */
    @Input() roles: Role[];
    /** Any roles that should be omitted from the dropdown */
    @Input() omit: Array<Role | RoleReferenceFromServer> = [];
    /** Optional title for the button. Defaults to "admin.add_permission_to_role" */
    @Input() title: string;
    /** Specify the icon on the button, either an "add" or a "remove" icon */
    @Input() icon: 'add' | 'remove' = 'add';
    /** Emits when a role is selected from the dropdown */
    @Output() select = new EventEmitter<Role>();

    filteredRoles: Role[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        this.filteredRoles = this.filterRoles(this.roles, this.omit);
    }

    private filterRoles(allRoles: Role[], rolesToOmit: Array<Role | RoleReferenceFromServer>): Role[] {
        return allRoles.filter(role => !rolesToOmit.map(roleToOmit => roleToOmit.uuid).includes(role.uuid));
    }
}
