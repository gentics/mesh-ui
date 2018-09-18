import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PublishStatusModelFromServer } from '../../../common/models/server-models';

import { Language, PublishModelMap } from './interfaces';

@Component({
    selector: 'mesh-available-languages-list',
    templateUrl: 'available-languages-list.component.html',
    styleUrls: ['available-languages-list.scss']
})
export class AvailableLanguagesListComponent implements OnChanges {
    @Input() available: PublishModelMap | Language[];
    @Input() current: string;

    public sortedLanguages: string[];

    ngOnChanges(changes: SimpleChanges): void {
        const langs = Array.isArray(this.available) ? this.available : Object.keys(this.available);

        // Sort languages alphabetically but put the current language first.
        this.sortedLanguages = langs
            .slice()
            .sort()
            .reverse()
            .sort((a, b) => (a === this.current ? -1 : 1));
    }
}
