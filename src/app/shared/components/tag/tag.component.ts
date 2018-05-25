import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TagReferenceFromServer } from '../../../common/models/server-models';
import { Tag } from '../../../common/models/tag.model';

@Component({
    selector: 'mesh-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
    @Input() tag: Tag | TagReferenceFromServer;
    @Input() filterTerm: String = '';

    @Input() removable = true;
    @Output() removeClick = new EventEmitter<void>();

    @Input() editable = false;
    @Output() editClick = new EventEmitter<void>();

    tagFamilyName(): string {
        if (typeof this.tag.tagFamily === 'string') {
            return this.tag.tagFamily;
        } else if (this.tag.tagFamily) {
            return this.tag.tagFamily.name!;
        } else {
            throw new Error(`Tag ${this.tag.name} has no tagFamily property.`);
        }
    }
}
