import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Group } from '../../../common/models/group.model';
import { GroupReferenceFromServer } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-user-group-select',
    templateUrl: './user-group-select.component.html',
    styleUrls: ['./user-group-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupSelectComponent implements OnChanges {

    /** Available groups to display in the dropdown */
    @Input() groups: Group[];
    /** Any groups that should be omitted from the dropdown */
    @Input() omit: Array<Group | GroupReferenceFromServer> = [];
    /** Optional title for the button. Defaults to "admin.add_user_to_group" */
    @Input() title: string;
    /** Specify the icon on the button, either an "add" or a "remove" icon */
    @Input() icon: 'add' | 'remove' = 'add';
    /** Emits when a group is selected from the dropdown */
    @Output() select = new EventEmitter<Group>();

    filteredGroups: Group[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        this.filteredGroups = this.filterGroups(this.groups, this.omit);
    }

    private filterGroups(allGroups: Group[], groupsToOmit: Array<Group | GroupReferenceFromServer>): Group[] {
        return allGroups.filter(group =>
            !groupsToOmit.map(groupToOmit => groupToOmit.uuid).includes(group.uuid)
        );
    }
}
