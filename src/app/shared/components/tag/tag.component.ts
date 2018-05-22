import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../../common/models/tag.model';
import { TagReferenceFromServer } from '../../../common/models/server-models';

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
        } else {
            return this.tag.tagFamily.name;
        }
    }
}
