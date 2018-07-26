import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'mesh-admin-list-item',
    template: ``
})

// tslint:disable-next-line:component-class-suffix
export class MockAdminListItem {
    @Input() checked = false;
    @Input() selectable = true;
    @Output() checkboxClick = new EventEmitter<boolean>();
}
