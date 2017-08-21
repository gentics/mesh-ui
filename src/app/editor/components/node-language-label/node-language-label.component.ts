import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'node-language-label',
    templateUrl: 'node-language-label.component.html',
    styleUrls: ['node-language-label.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeLanguageLabelComponent {

    @Input() language: string;

    constructor() {
    }
}
