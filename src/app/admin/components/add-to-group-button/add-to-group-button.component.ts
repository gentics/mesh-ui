import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Group } from '../../../common/models/group.model';
import { GroupReferenceFromServer } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-add-to-group-button',
    templateUrl: './add-to-group-button.component.html',
    styleUrls: ['./add-to-group-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToGroupButtonComponent implements OnChanges {

    /** Available groups to display in the dropdown */
    @Input() groups: Group[];
    /** Any groups that should be omitted from the dropdown */
    @Input() omit: Array<Group | GroupReferenceFromServer> = [];
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
