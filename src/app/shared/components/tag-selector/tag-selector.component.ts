import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { DropdownList } from 'gentics-ui-core';

import { Tag } from '../../../common/models/tag.model';
import { TagReferenceFromServer } from '../../../common/models/server-models';
import { KeyCode } from '../../../common/util/keycode';

/**
 * A drop-down tag selector component.
 */
@Component({
    selector: 'mesh-tag-selector',
    templateUrl: './tag-selector.component.html',
    styleUrls: ['./tag-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagSelectorComponent implements OnChanges, OnDestroy {

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

    @ViewChild(DropdownList) private dropDown: DropdownList;
    newTagName = '';
    selectedIndex = -1;

    private scrollTimer: number;

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
            this.selectedIndex = -1;
        }
        if ('filterTerm' in changes) {
            this.dropDown.resize();
            this.selectedIndex = -1;
            this.checkForUnknownTagName(this.filterTerm);
        }
    }

    ngOnDestroy(): void {
        clearTimeout(this.scrollTimer);
    }

    @HostListener('window:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (!this.active) {
            return;
        }

        switch (event.keyCode) {
            case KeyCode.DownArrow:
            case KeyCode.RightArrow:
                this.selectNext();
                break;
            case KeyCode.UpArrow:
            case KeyCode.LeftArrow:
                this.selectPrevious();
                break;
            case KeyCode.Enter:
                this.selectWithKeyboard();
                break;
            default:
        }
    }

    private selectNext(): void {
        const total = this.newTagName !== '' ? this.tags.length + 1 : this.tags.length;
        this.selectedIndex = (this.selectedIndex + 1) % total;
        this.scrollToSelectedOption();
    }

    private selectPrevious(): void {
        const total = this.newTagName !== '' ? this.tags.length + 1 : this.tags.length;
        this.selectedIndex = (this.selectedIndex === 0) ? total - 1 : this.selectedIndex - 1;
        this.scrollToSelectedOption();
    }

    private selectWithKeyboard(): void {
        if (this.selectedIndex === -1) {
            return;
        }
        if (this.selectedIndex < this.tags.length) {
            const tag = this.tags[this.selectedIndex];
            this.selectTag.emit(tag);
            this.dropDown.closeDropdown();
        } else if (this.selectedIndex === this.tags.length) {
            this.createNewTag.emit(this.newTagName);
            this.dropDown.closeDropdown();
        }
    }

    /**
     * When a list of options is too long, there will be a scroll bar. This method ensures that the currently-selected
     * options is scrolled into view in the options list.
     */
    private scrollToSelectedOption(): void {
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
            const container = this.dropDown.content.elementRef.nativeElement;
            const selectedItem = container.querySelector('.selected');
            if (selectedItem) {
                const belowContainer = container.offsetHeight + container.scrollTop < selectedItem.offsetTop + selectedItem.offsetHeight;
                const aboveContainer = selectedItem.offsetTop < container.scrollTop;

                if (belowContainer) {
                    container.scrollTop = selectedItem.offsetTop + selectedItem.offsetHeight - container.offsetHeight;
                }
                if (aboveContainer) {
                    container.scrollTop = selectedItem.offsetTop;
                }
            }
        });
    }

    private checkForUnknownTagName(filterTerm: string): void {
        if (!this.canCreate) {
            return;
        }
        // If the term does not perfectly match any of existing tags - we will show an option to create one
        if (!this.tags.some(tag => tag.name!.toLowerCase() === filterTerm.toLowerCase())) {
            this.newTagName = filterTerm;
        } else {
            this.newTagName = '';
        }
    }
}
