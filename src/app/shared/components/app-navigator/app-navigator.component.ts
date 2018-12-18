import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { animate, style, transition, trigger, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * A component which displays an icon which can be expanded to a dropdown menu showing all available apps
 *
 * ```
 *      <mesh-app-navigator
 *          [appList]="appList"
 *          (app)="navigateToApp(app)"
 *          icon="apps">
 *      </mesh-app-navigator>
 * ```
 */
@Component({
    selector: 'mesh-app-navigator',
    templateUrl: './app-navigator.component.html',
    styleUrls: ['./app-navigator.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('statusAnimation', [
            transition(':enter', [style({ opacity: 0 }), animate('0.05s', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('0.05s', style({ opacity: 0 }))])
        ])
    ]
})
export class AppNavigatorComponent {
    /**
     * If true, the icon is disabled and displays a gray icon.
     */
    @Input() disabled = false;

    /**
     * A Material Icon string, e.g. "folder". See https://design.google.com/icons/
     */
    @Input() icon = '';

    /**
     * List of apps available in the drop down
     */
    @Input()
    appList: Array<{
        name: string;
        label: string;
        icon: string;
    }> = [];

    /**
     * When the checkbox is clicked, emits the opposite of the current check state.
     */
    @Output() app: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Whether the menu is expanded or not.
     */
    expanded = false;

    onNavClicked(): void {
        if (this.disabled) {
            return;
        }
        this.expanded = !this.expanded;
    }

    onAppSelect(app: string): void {
        this.expanded = false;
        this.app.emit(app);
    }
}
