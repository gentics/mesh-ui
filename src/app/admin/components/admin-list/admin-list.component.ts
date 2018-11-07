import { animate, style, transition, trigger } from '@angular/animations';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef
} from '@angular/core';
import { PaginationInstance, PaginationService } from 'ngx-pagination';

import { HasUuid } from '../../../common/models/common.model';
import { toObject } from '../../../common/util/util';

/**
 * A paginated, selectable list for admin list views.
 *
 * @example
 * ```
 * <mesh-admin-list [items]="users$ | async"
 *                  [itemsPerPage]="10"
 *                  [currentPage]="currentPage"
 *                  (pageChange)="currentPage = $event"
 *                  (selectionChange)="selection = $event">
 *
 *     <--! Child elements will be placed in the list header area -->
 *     <gtx-button (click)="doStuffWithSelected()">Do stuff with selected</gtx-button>
 *
 *     <--! The rows of the list are defined by a child ng-template. Each item of the list can be bound to the template
 *          scope using the `let-<varName>="item"` syntax. -->
 *     <ng-template let-user="item">
 *         {{ user.firstname }} {{ user.lastname }} ({{ user.username }})
 *     </ng-template>
 *
 * </mesh-admin-list>
 * ```
 */
@Component({
    selector: 'mesh-admin-list',
    templateUrl: './admin-list.component.html',
    styleUrls: ['./admin-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaginationService],
    animations: [trigger('listAnimation', [transition(':enter', [style({ opacity: 0 }), animate(300)])])]
})
export class AdminListComponent<T extends HasUuid> implements OnChanges, AfterContentInit {
    /** An array of objects to be listed */
    @Input() items: T[] = [];
    /** Number of items on each paginated page */
    @Input() itemsPerPage = 10;
    /** Current page of pagination */
    @Input() currentPage = 1;
    /**
     * Total items in collection. If in-memory paging is being used as opposed to server-side paging,
     * this input can be omitted.
     */
    @Input() totalItems: number;
    /** Controls whether each row is selectable with a checkbox */
    @Input() selectable = true;
    /** An array of the selected items */
    @Input() selection: T[] = [];
    /** If true, no pagination will be displayed if there is only a single page  */
    @Input() autoHidePagination = false;
    /** Emits the page number of the page being switched to */
    @Output() pageChange = new EventEmitter<number>();
    /** Emits an array of the indexes of all selected items. Only applicable if `selectable` is true.*/
    @Output() selectionChange = new EventEmitter<T[]>();

    // Using ContentChildren rather than ContentChild because only ContentChildren
    // currently supports the { descendants: false } option.
    @ContentChildren(TemplateRef, { descendants: false })
    templateRefs: QueryList<TemplateRef<any>>;
    templateRef: TemplateRef<any>;

    paginationConfig: PaginationInstance;
    checked: { [uuid: string]: boolean } = {};
    itemsByKey: { [uuid: string]: T };
    checkedCount = 0;

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items && !changes.items.currentValue) {
            changes.items.currentValue = [];
            this.items = [];
        }

        const totalItems = this.totalItems || this.items.length;
        const currentPageMax = this.currentPage * this.itemsPerPage;
        let length;
        if (totalItems < currentPageMax) {
            length = totalItems % this.itemsPerPage;
        } else {
            length = this.itemsPerPage;
        }

        this.paginationConfig = {
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage
        };
        if (this.totalItems) {
            this.paginationConfig.totalItems = this.totalItems;
        }

        if (changes.items || changes.selection) {
            this.itemsByKey = toObject(item => item.uuid, it => it, [...this.items, ...this.selection]);
        }

        if ('selection' in changes) {
            this.checked = this.selectionToCheckedHash(this.selection);
            this.calculateCheckedCount();
        }
    }

    ngAfterContentInit(): void {
        this.templateRef = this.templateRefs.toArray()[0];
    }

    onItemCheckboxClick(item: T, checked: boolean): void {
        this.checked[item.uuid] = checked;
        this.calculateCheckedCount();
        this.emitSelectionChange();
    }

    onPageChange(pageNumber: number): void {
        this.pageChange.emit(pageNumber);
        this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    allSelected(): boolean {
        if (this.items.length === 0) {
            return false;
        }
        return this.items.every(item => this.checked[item.uuid]);
    }

    toggleSelectAll(): void {
        if (this.allSelected()) {
            this.items.forEach(item => {
                this.checked[item.uuid] = false;
            });
        } else {
            this.items.forEach(item => {
                this.checked[item.uuid] = true;
            });
        }
        this.calculateCheckedCount();
        this.emitSelectionChange();
    }

    clearSelection(): void {
        Object.keys(this.checked).forEach(key => (this.checked[key] = false));
        this.calculateCheckedCount();
        this.emitSelectionChange();
    }

    displayPaginationControls(): boolean {
        if (!this.autoHidePagination) {
            return true;
        }
        return this.itemsPerPage < Math.max(this.totalItems, this.items.length);
    }

    /**
     * Converts the `selection` array (and array of absolute indices of selected items) into the page-aware
     * `checked` hash map used to mark the checkbox state in the list.
     */
    private selectionToCheckedHash(selection: T[]): { [id: string]: boolean } {
        return toObject(item => item.uuid, () => true, selection);
    }

    private emitSelectionChange(): void {
        const selectedItems = Object.keys(this.checked)
            .filter(key => this.checked[key] === true)
            .map(key => this.itemsByKey[key]);
        this.selectionChange.emit(selectedItems);
    }

    private calculateCheckedCount(): void {
        this.checkedCount = Object.values(this.checked).filter(val => val === true).length;
    }
}
