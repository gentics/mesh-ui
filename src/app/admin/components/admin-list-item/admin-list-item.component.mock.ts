import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'mesh-admin-list-item',
    template: ``
})
export class MockAdminListItem {
    @Input() checked = false;
    @Input() selectable = true;
    @Output() checkboxClick = new EventEmitter<boolean>();
}
