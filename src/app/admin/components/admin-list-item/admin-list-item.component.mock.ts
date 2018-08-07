import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'mesh-admin-list-item',
    template: ``
})
export class MockAdminListItemComponent {
    @Input() checked = false;
    @Input() selectable = true;
    @Output() checkboxClick = new EventEmitter<boolean>();
}
