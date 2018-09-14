import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'mesh-version-label',
    templateUrl: 'version-label.component.html',
    styleUrls: ['version-label.scss']
})
export class VersionLabelComponent {
    @Input() version: string;
    @Input() published = false;
}
