import { by, element, promise, ElementFinder } from 'protractor';

import { PaginationControls } from '../pagination-controls.po';

import { GroupAdminListRow } from './group-admin-list-row.po';

export namespace GroupAdminList {
    export function pagination(): PaginationControls {
        return new PaginationControls(element(by.css('mesh-pagination-controls')));
    }

    export function displayedGroups(): Promise<GroupAdminListRow[]> {
        return element
            .all(by.css('mesh-admin-list-item'))
            .map(finder => new GroupAdminListRow(finder as ElementFinder));
    }

    export function setFilterQuery(query: string) {
        element(by.css('.filter gtx-input input')).sendKeys(query);
    }

    export async function setRoleFilter(roleName: string) {
        await element(by.css('.role-filter gtx-dropdown-list gtx-dropdown-trigger')).click();
        await element(by.cssContainingText('gtx-dropdown-content li', roleName)).click();
    }

    export async function createGroup(name: string) {
        await element(by.css('.list-controls button.regular.default')).click();
        await element(by.css('mesh-group-detail input')).sendKeys(name);
        await element(by.css('mesh-content-portal button')).click();
    }

    export function groupByName(name: string) {
        const finder = element
            .all(by.css('mesh-admin-list-item'))
            .filter(item =>
                item
                    .element(by.css('a'))
                    .getText()
                    .then((groupName: string) => groupName === name)
            )
            .first();

        return new GroupAdminListRow(finder);
    }

    export async function displayedGroupNames(): Promise<string[]> {
        const groups = await GroupAdminList.displayedGroups();
        const groupNames = await Promise.all(groups.map((group: GroupAdminListRow) => group.name()));
        return groupNames;
    }
}
