import { by, element } from 'protractor';

export namespace Schemalist {
    /** @returns list item identified by schema title */
    export function getAdminListItemByName(name: string) {
        return element(by.cssContainingText('mesh-admin-list mesh-admin-list-item', name));
    }
}
