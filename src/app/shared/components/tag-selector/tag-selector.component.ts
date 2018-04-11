import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Tag } from '../../../common/models/tag.model';
import { DropdownList } from 'gentics-ui-core';
import { TagReferenceFromServer } from '../../../common/models/server-models';

/**
 * A drop-down tag selector component.
 */
@Component({
    selector: 'mesh-tag-selector',
    templateUrl: './tag-selector.component.html',
    styleUrls: ['./tag-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagSelectorComponent implements OnChanges {

    /** The tags to display. No filtering is done within this component. */
    @Input() tags: Array<Tag | TagReferenceFromServer>;
    /** The term used to filter the tags, used to highlight the matches */
    @Input() filterTerm = '';
    /** When true, the tag list will be displayed */
    @Input() active = false;
    /** When true, a "create new tag" option will be displayed for non-matching filterTerms */
    @Input() canCreate = false;
    /** Fired when a tag is selected */
    @Output() selectTag = new EventEmitter<Tag | TagReferenceFromServer>();
    /** Fired when "create new tag" is clicked. Only applicable is canCreate is true. */
    @Output() createNewTag = new EventEmitter<string>();
    /** Fired when the underlying DropdownList closes */
    @Output() close = new EventEmitter<void>();

    @ViewChild(DropdownList) dropDown: DropdownList;
    newTagName = '';

    ngOnChanges(changes: SimpleChanges): void {
        if ('active' in changes) {
            if (this.active) {
                if (!this.dropDown.isOpen) {
                    this.dropDown.openDropdown();
                }
                this.dropDown.resize();
            } else {
                this.dropDown.closeDropdown();
            }
        }
        if ('filterTerm' in changes) {
            this.dropDown.resize();
            this.checkForUnknownTagName(this.filterTerm);
        }
    }

    private checkForUnknownTagName(filterTerm: string): void {
        if (!this.canCreate) {
            return;
        }
        // If the term does NOT perfectly match any of existing tags - we will show an option to create one
        if (!this.tags.some(tag => tag.name.toLowerCase() === filterTerm.toLowerCase())) {
            this.newTagName = filterTerm;
        } else {
            this.newTagName = '';
        }
    }
}
