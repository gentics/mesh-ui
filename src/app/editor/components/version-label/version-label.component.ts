import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'version-label',
    templateUrl: 'version-label.component.html',
    styleUrls: ['version-label.scss']
})

export class VersionLabelComponent implements OnChanges {
    @Input() version: string;
    isPublishedVersion: boolean = false;

    ngOnChanges(): void {
        this.isPublishedVersion = !!this.version && this.version.slice(-2) === '.0';
    }
}
