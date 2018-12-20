import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MeshNode } from '../../../common/models/node.model';

@Component({
    selector: 'mesh-available-languages-list',
    templateUrl: 'available-languages-list.component.html',
    styleUrls: ['available-languages-list.scss']
})
export class AvailableLanguagesListComponent implements OnChanges {
    @Input() node: MeshNode;
    @Input() current: string;
    @Output() nodeLanguage: EventEmitter<string> = new EventEmitter<string>();

    public sortedLanguages: string[];

    onClickOnLanguage(language: string): void {
        this.nodeLanguage.emit(language);
    }

    // ONCHANGES
    ngOnChanges(): void {
        const langs = Array.isArray(this.node.availableLanguages)
            ? this.node.availableLanguages
            : Object.keys(this.node.availableLanguages);

        // Sort languages alphabetically but put the current language first.
        this.sortedLanguages = langs
            .slice()
            .sort()
            .reverse()
            .sort((a, b) => (a === this.current ? -1 : 1));
    }
}
