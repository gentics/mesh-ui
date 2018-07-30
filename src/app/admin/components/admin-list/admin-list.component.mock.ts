import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'mesh-admin-list',
    template: ``
})
export class MockAdminListComponent {
    @Input() items: any;
    @Input() itemsPerPage: any;
    @Input() totalItems: any;
    @Input() currentPage: any;
    @Input() selectable = true;
    @Input() selection: any;
    @Input() autoHidePagination = false;
    @Output() pageChange = new EventEmitter<any>();
}
