import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../../common/models/tag.model';

@Component({ selector: 'mesh-tag-selector', template: '' })
export class MockTagSelectorComponent {
    @Input() tags: any;
    @Input() active: any;
    @Input() filterTerm: any;
    @Input() canCreate: any;

    @Output() selectTag = new EventEmitter<Tag>();
    @Output() createNewTag = new EventEmitter<string>();
}
