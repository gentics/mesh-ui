import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'mesh-icon-checkbox',
    templateUrl: './icon-checkbox.component.html',
    styleUrls: ['./icon-checkbox.component.scss']
})
export class IconCheckboxComponent implements OnInit {
    @Input() value: boolean;

    @Input() iconName: string | null = null;

    @Input() actionName: string | null = null;

    @Input() label: string | null = null;

    @Output() action = new EventEmitter<boolean>();

    inputValue = false;

    ngOnInit() {
        this.inputValue = this.value;
    }

    check(): void {
        this.action.emit(!this.inputValue);
    }
}
