import { by, element, promise, ElementFinder } from 'protractor';

import { PaginationControls } from '../pagination-controls.po';

import { RoleAdminListRow } from './role-admin-list-row.po';

export namespace RoleAdminList {
    export function pagination(): PaginationControls {
        return new PaginationControls(element(by.css('mesh-pagination-controls')));
    }

    export function displayedRoles(): promise.Promise<RoleAdminListRow[]> {
        return element.all(by.css('mesh-admin-list-item')).map(finder => new RoleAdminListRow(finder as ElementFinder));
    }

    export function setFilterQuery(query: string) {
        element(by.css('.filter gtx-input input')).sendKeys(query);
    }

    export async function setRoleFilter(roleName: string) {
        await element(by.css('.role-filter gtx-dropdown-list gtx-dropdown-trigger')).click();
        await element(by.cssContainingText('gtx-dropdown-content li', roleName)).click();
    }

    export async function createRole(name: string) {
        await element(by.css('.list-controls button.regular.default')).click();
        await element(by.css('mesh-role-detail input')).sendKeys(name);
        await element(by.css('mesh-content-portal button')).click();
    }

    export function roleByName(name: string) {
        const finder = element
            .all(by.css('mesh-admin-list-item'))
            .filter(item =>
                item
                    .element(by.css('a'))
                    .getText()
                    .then(roleName => roleName === name)
            )
            .first();

        return new RoleAdminListRow(finder);
    }

    export async function displayedRoleNames(): Promise<string[]> {
        const roles = await RoleAdminList.displayedRoles();
        const roleNames = await promise.all(roles.map(role => role.name()));
        return roleNames;
    }
}
