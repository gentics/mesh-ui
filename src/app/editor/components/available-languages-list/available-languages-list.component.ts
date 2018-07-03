import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PublishStatusModelFromServer } from '../../../common/models/server-models';

@Component({
    selector: 'mesh-available-languages-list',
    templateUrl: 'available-languages-list.component.html',
    styleUrls: ['available-languages-list.scss']
})
export class AvailableLanguagesListComponent implements OnChanges {
    @Input() available: { [key: string]: PublishStatusModelFromServer };
    @Input() current: string;

    public sortedLanguages: string[];

    ngOnChanges(changes: SimpleChanges): void {
        // Sort languages alphabetically but put the current language first.
        this.sortedLanguages = Object.keys(this.available)
            .slice()
            .sort()
            .reverse()
            .sort((a, b) => (a === this.current ? -1 : 1));
    }
}
