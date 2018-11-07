import { Component, EventEmitter, Output } from '@angular/core';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Checkbox } from 'gentics-ui-core';
import { NgxPaginationModule } from 'ngx-pagination';

import { configureComponentTest } from '../../../../testing/configure-component-test';
import { AdminListItemComponent } from '../admin-list-item/admin-list-item.component';

import { AdminListComponent } from './admin-list.component';

const User1 = { uuid: '1', firstName: 'Ada', lastName: 'Lovelace' };
const User2 = { uuid: '2', firstName: 'Charles', lastName: 'Babbage' };
const User3 = { uuid: '3', firstName: 'George', lastName: 'Byron' };

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
                MockPaginationControlsComponent
            ],
            imports: [NgxPaginationModule, NoopAnimationsModule]
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

        it(
            'checking "select all" selects all rows on current page',
            fakeAsync(() => {
                fixture.detectChanges();

                const selectAll = getSelectAllCheckbox(fixture);
                selectAll.change.emit(true);
                tick();
                fixture.detectChanges();

                expect(allItemsOnPageAreChecked(fixture)).toBe(true);
            })
        );

        it(
            'checking "select all" deselects all rows on current page if all are already selected',
            fakeAsync(() => {
                fixture.detectChanges();

                checkAllListItems(fixture);
                fixture.detectChanges();
                expect(allItemsOnPageAreChecked(fixture)).toBe(true, 'all items checked');

                const selectAll = getSelectAllCheckbox(fixture);
                selectAll.change.emit(false);
                tick();
                fixture.detectChanges();

                expect(noItemsOnPageAreChecked(fixture)).toBe(true, 'no items checked');
            })
        );

        it(
            '"select all" becomes checked when all rows on current page are checked',
            fakeAsync(() => {
                fixture.detectChanges();

                const selectAll = getSelectAllCheckbox(fixture);
                expect(selectAll.checked).toBe(false);

                const listItems = getAdminListItems(fixture);
                listItems.forEach(listItem => listItem.checkboxClick.emit(true));
                tick();
                fixture.detectChanges();

                expect(selectAll.checked).toBe(true);
            })
        );

        it(
            'selections persist when changing page',
            fakeAsync(() => {
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
            })
        );

        it(
            'checkedCount updates when list items are checked and unchecked',
            fakeAsync(() => {
                instance.onSelectionChange = (selection: any[]) => (instance.selection = selection);
                instance.users = [User1, User2];
                instance.itemsPerPage = 2;
                fixture.detectChanges();

                expect(getCheckedCount(fixture)).toBe(0);

                // check all items on the first page
                checkAllListItems(fixture);
                fixture.detectChanges();
                expect(getCheckedCount(fixture)).toBe(2);

                // move to page 2 and check all items
                instance.currentPage = 2;
                instance.users = [User3];
                fixture.detectChanges();

                checkAllListItems(fixture);
                fixture.detectChanges();
                expect(getCheckedCount(fixture)).toBe(3);

                // move back to page 1 and uncheck all page 1 items
                instance.currentPage = 1;
                instance.users = [User1, User2];
                fixture.detectChanges();

                const selectAll = getSelectAllCheckbox(fixture);
                selectAll.change.emit(false);
                tick();
                fixture.detectChanges();
                expect(getCheckedCount(fixture)).toBe(1);
            })
        );

        it(
            'clear-selection clears the selection',
            fakeAsync(() => {
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
            })
        );

        it(
            'selectionChange event emits the selected items when selection changes',
            fakeAsync(() => {
                instance.itemsPerPage = 2;
                fixture.detectChanges();

                // check all items on the first page
                checkAllListItems(fixture);

                expect(instance.onSelectionChange).toHaveBeenCalledWith([User1, User2]);

                instance.currentPage = 2;
                fixture.detectChanges();
                checkAllListItems(fixture);
                expect(instance.onSelectionChange).toHaveBeenCalledWith([User1, User2, User3]);
            })
        );

        it(
            'binding to selection checks the selected items',
            fakeAsync(() => {
                instance.selection = [User1, User3];
                fixture.detectChanges();

                const listItems = getAdminListItems(fixture);

                expect(listItems[0].checked).toBeTruthy();
                expect(listItems[1].checked).toBeFalsy();
                expect(listItems[2].checked).toBeTruthy();
            })
        );

        it(
            'binding to selection checks the selected indices with multiple pages',
            fakeAsync(() => {
                instance.itemsPerPage = 2;
                instance.users = [User1, User2];
                instance.selection = [User2, User3];
                fixture.detectChanges();

                const listItemsPage1 = getAdminListItems(fixture);

                expect(listItemsPage1[0].checked).toBeFalsy();
                expect(listItemsPage1[1].checked).toBeTruthy();

                instance.currentPage = 2;
                instance.users = [User3];
                fixture.detectChanges();
                const listItemsPage2 = getAdminListItems(fixture);

                expect(listItemsPage2[0].checked).toBeTruthy();
            })
        );
    });
});

function getRowElements(fixture: ComponentFixture<TestComponent>): HTMLElement[] {
    return fixture.debugElement.queryAll(By.css('.row')).map(de => de.nativeElement);
}

function getAdminListItems(fixture: ComponentFixture<TestComponent>): AdminListItemComponent[] {
    return fixture.debugElement.queryAll(By.directive(AdminListItemComponent)).map(de => de.componentInstance);
}

@Component({
    selector: 'mesh-test-component',
    template: `
        <mesh-admin-list [items]="users"
                         [itemsPerPage]="itemsPerPage"
                         [currentPage]="currentPage"
                         [autoHidePagination]="autoHidePagination"
                         [selection]="selection"
                         [totalItems]="totalItems"
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
    totalItems = 3;
    users = [User1, User2, User3];
    autoHidePagination = false;
    onSelectionChange: any = jasmine.createSpy('onSelectionChange');
    selection: any[] = [];
}

@Component({
    selector: 'mesh-pagination-controls',
    template: ``
})
class MockPaginationControlsComponent {
    @Output() pageChange = new EventEmitter<number>();
}
