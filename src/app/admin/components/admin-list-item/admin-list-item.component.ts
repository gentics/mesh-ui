import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * An item in the {@link AdminListComponent}. Not intended to be used in any other context.
 */
@Component({
    selector: 'mesh-admin-list-item',
    templateUrl: 'admin-list-item.component.html',
    styleUrls: ['admin-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminListItemComponent {
    @Input() checked = false;
    @Input() selectable = true;
    @Output() checkboxClick = new EventEmitter<boolean>();
}
