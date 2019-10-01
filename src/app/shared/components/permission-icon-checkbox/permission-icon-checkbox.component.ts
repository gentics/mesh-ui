import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'mesh-permission-icon-checkbox',
    templateUrl: './permission-icon-checkbox.component.html',
    styleUrls: ['./permission-icon-checkbox.component.scss']
})
export class PermissionIconCheckboxComponent {
    @Input() value = false;

    @Input() iconName: string | null = null;

    @Input() actionName: string | null = null;

    @Input() label: string | null = null;

    @Input() disabled = false;

    @Output() action = new EventEmitter<boolean>();

    check(): void {
        this.action.emit(!this.value);
    }
}
