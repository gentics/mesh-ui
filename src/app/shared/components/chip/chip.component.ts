import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'mesh-chip',
    templateUrl: './chip.component.html',
    styleUrls: ['./chip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
    @Input() removeTitle = '';
    @Input() removable = true;
    @Output() removeClick = new EventEmitter<void>();

    @Input() editTitle = '';
    @Input() editable = false;
    @Output() editClick = new EventEmitter<void>();
}
