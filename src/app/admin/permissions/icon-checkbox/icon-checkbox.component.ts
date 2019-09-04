import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'mesh-icon-checkbox',
    templateUrl: './icon-checkbox.component.html',
    styleUrls: ['./icon-checkbox.component.scss']
})
export class IconCheckboxComponent {
    @Input() value = false;

    @Input() iconName: string | null = null;

    @Input() actionName: string | null = null;

    @Input() label: string | null = null;

    @Output() action = new EventEmitter<boolean>();

    check(): void {
        this.action.emit(!this.value);
    }
}
