import { Component, EventEmitter, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { Checkbox } from 'gentics-ui-core';

import { AdminListComponent } from './admin-list.component';
import { AdminListItemComponent } from '../admin-list-item/admin-list-item.component';
import { configureComponentTest } from '../../../../testing/configure-component-test';

describe('AdminListComponent', () => {
    let instance: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        configureComponentTest({
            declarations: [
                TestComponent,
                AdminListComponent,
                AdminListItemComponent,
                Checkbox,
                MockPaginationControls
            ],
            imports: [
                NgxPaginationModule,
                NoopAnimationsModule
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(instance).toBeTruthy();
    });

    it('renders a row for each item', () => {
        fixture.detectChanges();

        const rows = getRowElements(fixture);
        expect(rows.length).toBe(3);
    });

    it('binds the items to the row', () => {
        fixture.detectChanges();

        const rows = getRowElements(fixture);
        expect(rows[0].innerText).toContain('Ada Lovelace');
    });

    it('hides the pagination if there is only 1 page and autoHidePagination = true', () => {
        instance.autoHidePagination = true;
        fixture.detectChanges();

        const paginationControls = fixture.debugElement.query(By.css('mesh-pagination-controls'));
        expect(paginationControls === null).toBe(true);
    });

    it('does not hide the pagination if there is only 1 page and autoHidePagination = false', () => {
        instance.autoHidePagination = false;
        fixture.detectChanges();

        const paginationControls = fixture.debugElement.query(By.css('mesh-pagination-controls'));
        expect(paginationControls === null).toBe(false);
    });

    it('shows the placeholder if items array is empty', () => {
        instance.users = [];
        fixture.detectChanges();

        const placeholder = fixture.debugElement.query(By.css('.no-results'));
        expect(placeholder === null).toBe(false);
    });

    describe('checkbox selection', () => {

        function allItemsOnPageAreChecked(_fixture: ComponentFixture<TestComponent>): boolean {
            return getAdminListItems(_fixture).every(listItem => listItem.checked);
        }

        function noItemsOnPageAreChecked(_fixture: ComponentFixture<TestComponent>): boolean {
            return getAdminListItems(_fixture).every(listItem => !listItem.checked);
        }

        function checkAllListItems(_fixture: ComponentFixture<TestComponent>): void {
            getAdminListItems(_fixture).forEach(listItem => listItem.checkboxClick.emit(true));
            tick();
        }

        function getSelectAllCheckbox(_fixture: ComponentFixture<TestComponent>): Checkbox {
            return _fixture.debugElement.query(By.css('.select-all')).componentInstance;
        }

        function getCheckedCount(_fixture: ComponentFixture<TestComponent>): number {
            return _fixture.debugElement.query(By.directive(AdminListComponent)).componentInstance.checkedCount;
        }


        it('"select all" is not checked if there are no results', () => {
            instance.users = [];
            fixture.detectChanges();

            const selectAll = getSelectAllCheckbox(fixture);
            expect(selectAll.checked).toBe(false);
        });

        it('checking "select all" selects all rows on current page', fakeAsync(() => {
            fixture.detectChanges();

            const selectAll = getSelectAllCheckbox(fixture);
            selectAll.change.emit(true);
            tick();
            fixture.detectChanges();

            expect(allItemsOnPageAreChecked(fixture)).toBe(true);
        }));

        it('checking "select all" deselects all rows on current page if all are already selected', fakeAsync(() => {
            fixture.detectChanges();

            checkAllListItems(fixture);
            fixture.detectChanges();
            expect(allItemsOnPageAreChecked(fixture)).toBe(true, 'all items checked');

            const selectAll = getSelectAllCheckbox(fixture);
            selectAll.change.emit(false);
            tick();
            fixture.detectChanges();

            expect(noItemsOnPageAreChecked(fixture)).toBe(true, 'no items checked');
        }));

        it('"select all" becomes checked when all rows on current page are checked', fakeAsync(() => {
            fixture.detectChanges();

            const selectAll = getSelectAllCheckbox(fixture);
            expect(selectAll.checked).toBe(false);

            const listItems = getAdminListItems(fixture);
            listItems.forEach(listItem => listItem.checkboxClick.emit(true));
            tick();
            fixture.detectChanges();

            expect(selectAll.checked).toBe(true);
        }));

        it('selections persist when changing page', fakeAsync(() => {
            instance.itemsPerPage = 2;
            fixture.detectChanges();

            // check all items on the first page
            checkAllListItems(fixture);
            fixture.detectChanges();

            // all items on page 1 are checked
            expect(allItemsOnPageAreChecked(fixture)).toBe(true);

            // move to page 2
            instance.currentPage = 2;
            fixture.detectChanges();

            // no items are checked on page 2
            expect(allItemsOnPageAreChecked(fixture)).toBe(false);

            // move back to page 1
            instance.currentPage = 1;
            fixture.detectChanges();

            // all items on page 1 are still checked
            expect(allItemsOnPageAreChecked(fixture)).toBe(true);
        }));

        it('checkedCount updates when list items are checked and unchecked', fakeAsync(() => {
            instance.itemsPerPage = 2;
            fixture.detectChanges();

            expect(getCheckedCount(fixture)).toBe(0);

            // check all items on the first page
            checkAllListItems(fixture);
            fixture.detectChanges();
            expect(getCheckedCount(fixture)).toBe(2);

            // move to page 2 and check all items
            instance.currentPage = 2;
            fixture.detectChanges();

            checkAllListItems(fixture);
            fixture.detectChanges();
            expect(getCheckedCount(fixture)).toBe(3);

            // move back to page 1 and uncheck all page 1 items
            instance.currentPage = 1;
            fixture.detectChanges();

            const selectAll = getSelectAllCheckbox(fixture);
            selectAll.change.emit(false);
            tick();
            fixture.detectChanges();
            expect(getCheckedCount(fixture)).toBe(1);
        }));

        it('clear-selection clears the selection', fakeAsync(() => {
            instance.itemsPerPage = 2;
            fixture.detectChanges();

            // check all items on the first page
            checkAllListItems(fixture);
            // move to page 2 and check all items
            instance.currentPage = 2;
            fixture.detectChanges();
            checkAllListItems(fixture);
            fixture.detectChanges();

            expect(getCheckedCount(fixture)).toBe(3);

            const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
            clearSelection.triggerEventHandler('click', {});
            tick();

            expect(getCheckedCount(fixture)).toBe(0);
        }));

        it('selectionChange event emits the selected indices when selection changes', fakeAsync(() => {
            instance.itemsPerPage = 2;
            fixture.detectChanges();

            // check all items on the first page
            checkAllListItems(fixture);

            expect(instance.onSelectionChange).toHaveBeenCalledWith([0, 1]);

            instance.currentPage = 2;
            fixture.detectChanges();
            checkAllListItems(fixture);
            expect(instance.onSelectionChange).toHaveBeenCalledWith([0, 1, 2]);
        }));

        it('binding to selection checks the selected indices', fakeAsync(() => {
            instance.selection = [0, 2];
            fixture.detectChanges();

            const listItems = getAdminListItems(fixture);

            expect(listItems[0].checked).toBe(true);
            expect(listItems[1].checked).toBe(false);
            expect(listItems[2].checked).toBe(true);
        }));

        it('binding to selection checks the selected indices with multiple pages', fakeAsync(() => {
            instance.itemsPerPage = 2;
            instance.selection = [1, 2];
            fixture.detectChanges();

            const listItemsPage1 = getAdminListItems(fixture);

            expect(listItemsPage1[0].checked).toBe(false);
            expect(listItemsPage1[1].checked).toBe(true);

            instance.currentPage = 2;
            fixture.detectChanges();
            const listItemsPage2 = getAdminListItems(fixture);

            expect(listItemsPage2[0].checked).toBe(true);
        }));
    });

});

function getRowElements(fixture: ComponentFixture<TestComponent>): HTMLElement[] {
    return fixture.debugElement.queryAll(By.css('.row'))
        .map(de => de.nativeElement);
}

function getAdminListItems(fixture: ComponentFixture<TestComponent>): AdminListItemComponent[] {
    return fixture.debugElement.queryAll(By.directive(AdminListItemComponent))
        .map(de => de.componentInstance);
}

@Component({
    selector: 'test-component',
    template: `
        <mesh-admin-list [items]="users"
                         [itemsPerPage]="itemsPerPage"
                         [currentPage]="currentPage"
                         [autoHidePagination]="autoHidePagination"
                         [selection]="selection"
                         (selectionChange)="onSelectionChange($event)"
                         (pageChange)="currentPage = $event">
            <ng-template let-user="item">
                <div class="row">{{ user.firstName }} {{ user.lastName }}</div>
            </ng-template>
        </mesh-admin-list>
    `
})
class TestComponent {
    itemsPerPage = 10;
    currentPage = 1;
    users = [
        { firstName: 'Ada', lastName: 'Lovelace' },
        { firstName: 'Charles', lastName: 'Babbage' },
        { firstName: 'George', lastName: 'Byron' }
    ];
    autoHidePagination = false;
    onSelectionChange = jasmine.createSpy('onSelectionChange');
    selection = [];
}

@Component({
    selector: 'mesh-pagination-controls',
    template: ``
})
class MockPaginationControls {
    @Output() pageChange = new EventEmitter<number>();
}
