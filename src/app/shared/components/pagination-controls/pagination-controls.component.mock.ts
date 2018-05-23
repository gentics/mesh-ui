import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'mesh-pagination-controls',
    template: '',
})
export class MockPaginationControlsComponent {
    @Input() id: string;
    @Input() directionLinks = true;
    @Output() pageChange = new EventEmitter<number>();
}
