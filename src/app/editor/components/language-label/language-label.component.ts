import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'language-label',
    templateUrl: 'language-label.component.html',
    styleUrls: ['language-label.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeLanguageLabelComponent {

    @Input() language: string;

    constructor() {
    }
}
