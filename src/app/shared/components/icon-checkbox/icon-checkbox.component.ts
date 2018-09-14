import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * A component which displays an icon, which turns into a checkbox on hover and can be
 * selected. If selected, it remains in the checkbox state.
 * This is a slightly modified copy of the IconCheckbox component from the gentics-cms-ui.
 *
 * The "hover" state may alse be triggered by hovering an ancestor DOM element which has the class
 * `icon-checkbox-trigger`. This allows an implementation where hovering anywhere on a row will display the
 * checkbox, rather than only hovering over the icon.
 *
 * ```
 * <icon-checkbox [selected]="isSelected"
 *                (change)="toggleSelect()"
 *                icon="folder">
 * </icon-checkbox>
 * ```
 */
@Component({
    selector: 'mesh-icon-checkbox',
    templateUrl: './icon-checkbox.component.html',
    styleUrls: ['./icon-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconCheckboxComponent {
    /**
     * Whether the checkbox is selected or not.
     */
    @Input() selected = false;

    /**
     * If true, the selection is disabled and displays a gray icon.
     */
    @Input() disabled = false;

    /**
     * A Material Icon string, e.g. "folder". See https://design.google.com/icons/
     */
    @Input() icon = '';

    /**
     * When the checkbox is clicked, emits the opposite of the current check state.
     */
    @Output() change = new EventEmitter<boolean>();

    checkboxClicked(checkState: boolean): void {
        this.change.emit(checkState);
    }
}
