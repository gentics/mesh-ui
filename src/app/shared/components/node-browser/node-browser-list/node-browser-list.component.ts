import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PageResult } from '../interfaces';

@Component({
    selector: 'mesh-node-browser-list',
    templateUrl: './node-browser-list.component.html',
    styleUrls: ['./node-browser-list.component.scss']
})
export class NodeBrowserListComponent {
    constructor() {}

    selection: { [uuid: string]: PageResult } = {};

    @Input() items: PageResult[] | null;
    @Input() selectable = () => true;
    @Input() multiple = false;

    @Output() containerClicked: EventEmitter<PageResult> = new EventEmitter();
    @Output() selectedChange: EventEmitter<PageResult[]> = new EventEmitter();

    handleSelect(item: PageResult, selected: boolean) {
        if (this.multiple) {
            if (selected) {
                this.selection[item.uuid] = item;
            } else {
                delete this.selection[item.uuid];
            }
        } else {
            if (selected) {
                this.selection = {
                    [item.uuid]: item
                };
            } else {
                this.selection = {};
            }
        }
        this.selectedChange.emit(Object.values(this.selection));
    }
}
