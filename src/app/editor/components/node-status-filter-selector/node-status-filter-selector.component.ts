import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';

import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'mesh-node-status-filter-selector',
    templateUrl: 'node-status-filter-selector.component.html',
    styleUrls: ['node-status-filter-selector.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeStatusFilterSelectorComponent {
    /** The node statuses to display. */
    @Input() nodeStatuses: EMeshNodeStatusStrings[];

    /** The selected node statuses. */
    @Input() selectedNodeStatusFilter: EMeshNodeStatusStrings[];

    /** Fired when a set of node status strings is selected */
    @Output() selectedNodeStatusFilterChange = new EventEmitter<EMeshNodeStatusStrings[]>();

    constructor() {}

    itemClick(selectedNodeStatusFilter: EMeshNodeStatusStrings[]): void {
        this.selectedNodeStatusFilterChange.emit(selectedNodeStatusFilter);
    }
}

@Pipe({ name: 'isAllNodeStatuses' })
export class IsAllNodeStatusesPipe implements PipeTransform {
    transform(value: EMeshNodeStatusStrings[], nodeStatuses: EMeshNodeStatusStrings[]): boolean {
        return nodeStatuses.every(nodeStatus => value.includes(nodeStatus));
    }
}
