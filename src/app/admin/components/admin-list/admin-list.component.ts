import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef
} from '@angular/core';
import { PaginationInstance, PaginationService } from 'ngx-pagination';
import { animate, style, transition, trigger } from '@angular/animations';

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
    animations: [
        trigger('listAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(300)
            ])
        ])
    ]
})
export class AdminListComponent implements OnChanges {

    /** An array of objects to be listed */
    @Input() items: any = [];
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
    /** If true, no pagination will be displayed if there is only a single page  */
    @Input() autoHidePagination = false;
    /** Emits the page number of the page being switched to */
    @Output() pageChange = new EventEmitter<number>();
    /** Emits an array of the indexes of all selected items. Only applicable if `selectable` is true.*/
    @Output() selectionChange = new EventEmitter<number[]>();

    @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

    paginationConfig: PaginationInstance;
    checked: { [id: string]: boolean } = {};
    checkedCount = 0;
    private currentPageIndices: number[];

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(): void {
        const totalItems = this.totalItems || this.items.length;
        const currentPageMax = this.currentPage * this.itemsPerPage;
        let length;
        if (totalItems < currentPageMax) {
            length = totalItems % this.itemsPerPage;
        } else {
            length = this.itemsPerPage;
        }
        this.currentPageIndices =  Array.from({ length }, (_, i) => i);

        this.paginationConfig = {
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage
        };
        if (this.totalItems) {
            this.paginationConfig.totalItems = this.totalItems;
        }
    }

    onItemCheckboxClick(index: number, checked: boolean): void {
        this.checked[this.itemId(index)] = checked;
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
        return this.currentPageIndices
            .every((_, i) => this.checked[this.itemId(i)]);
    }

    toggleSelectAll(): void {
        if (this.allSelected()) {
            this.currentPageIndices
                .forEach((_, i) => {
                    this.checked[this.itemId(i)] = false;
                });
        } else {
            this.currentPageIndices
                .forEach((_, i) => {
                    this.checked[this.itemId(i)] = true;
                });
        }
        this.calculateCheckedCount();
        this.emitSelectionChange();
    }

    clearSelection(): void {
        Object.keys(this.checked)
            .forEach(key => this.checked[key] = false);
        this.calculateCheckedCount();
        this.emitSelectionChange();
    }

    itemId(index: number): string {
        return `${this.currentPage}-${index}`;
    }

    displayPaginationControls(): boolean {
        if (!this.autoHidePagination) {
            return true;
        }
        return this.itemsPerPage < Math.max(this.totalItems, this.items.length);
    }

    private emitSelectionChange(): void {
        const selectedIndices = Object.keys(this.checked)
            .filter(key => this.checked[key] === true)
            .map(key => {
                const [ page, index ] = key.split('-').map(val => +val);
                return (page - 1) * this.itemsPerPage + index;
            });
        this.selectionChange.emit(selectedIndices);
    }

    private calculateCheckedCount(): void {
        this.checkedCount = Object.values(this.checked).filter(val => val === true).length;
    }
}
