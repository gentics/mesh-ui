import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'mesh-pagination-controls',
    templateUrl: './pagination-controls.component.html',
    styleUrls: ['./pagination-controls.component.scss']
})
export class PaginationControlsComponent {
    @Input() id: string;
    @Input() directionLinks = true;
    @Output() pageChange = new EventEmitter<number>();
}
