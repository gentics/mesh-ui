import { browser, by, element, until } from 'protractor';

import { HasUuid } from '../../src/app/common/models/common.model';

export async function navigateToHome() {
    await browser.get('/');
    const url = await browser.getCurrentUrl();
    if (url.match(/login$/)) {
        await login();
    }
}

async function login() {
    await element(by.css('input[name="username"]')).sendKeys('admin');
    await element(by.css('input[name="password"]')).sendKeys('admin');
    await element(by.tagName('button')).click();
    // This seems to be necessary sometimes
    await browser.waitForAngular();
}

export async function navigateToNodeEdit(node: HasUuid, language = 'en') {
    await browser.get(`/#/editor/project/(detail:demo/${node.uuid}/${language})`);
}

export async function navigateToFolder(node: HasUuid, language = 'en') {
    await browser.get(`/#/editor/project/(list:demo/${node.uuid}/${language})`);
}

export async function navigateToGroupAdmin() {
    await goToRoute(`admin/groups`);
}

export async function navigateToRoleAdmin() {
    await goToRoute(`admin/roles`);
}

/** @description Navigate to schema editor */
export async function navigateToAdminSchemaEditor() {
    await goToRoute(`admin/schemas`);
}
/** @description Navigate to schema editor in 'create new' mode with empty input fields */
export async function navigateToAdminSchemaEditorNew() {
    await goToRoute(`admin/schemas/new`);
}
/** @description Navigate to specified schema in schema editor */
export async function navigateToAdminSchemaEditorExistingSchema(schemaUuid: string) {
    await goToRoute(`admin/schemas/${schemaUuid}`);
}

/** @description Navigate to microschema editor */
export async function navigateToAdminMicroschemaEditor() {
    await goToRoute(`admin/microschemas`);
}
/** @description Navigate to microschema editor in 'create new' mode with empty input fields */
export async function navigateToAdminMicroschemaEditorNew() {
    await goToRoute(`admin/microschemas/new`);
}
/** @description Navigate to specified microschema in schema editor */
export async function navigateToAdminMicroschemaEditorExistingSchema(schemaUuid: string) {
    await goToRoute(`admin/microschemas/${schemaUuid}`);
}

async function goToRoute(route: string) {
    await browser.executeScript((route: string) => (window.location.href = `/#${route}`), route);
}
