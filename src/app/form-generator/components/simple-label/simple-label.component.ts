import { Component, Input, OnInit } from '@angular/core';

import { MeshFieldControlApi } from '../../common/form-generator-models';

@Component({
    selector: 'mesh-simple-label',
    templateUrl: './simple-label.component.html',
    styleUrls: ['./simple-label.component.scss']
})
export class SimpleLabelComponent implements OnInit {
    @Input() api: MeshFieldControlApi;
    @Input() value: any;

    removable = false;

    constructor() {}

    ngOnInit() {}

    removeContent() {
        this.api.setValue(null);
    }

    isRemovable() {
        return !this.api.readOnly && this.value !== null;
    }
}
