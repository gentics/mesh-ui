import { Input, Component, EventEmitter, Output } from '@angular/core';

@Component({ selector: 'mesh-tag', template: '' })
export class MockTagComponent {
    @Input() tag: any;

    @Input() filterTerm: String = '';

    @Input() removable = true;
    @Output() removeClick = new EventEmitter<void>();

    @Input() editable = false;
    @Output() editClick = new EventEmitter<void>();
}
