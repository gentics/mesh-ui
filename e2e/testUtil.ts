import * as path from 'path';
import { browser, promise, ElementFinder, WebElement } from 'protractor';
import * as uuid from 'uuid-random';

import { MeshNode } from '../src/app/common/models/node.model';
import { SchemaCreateRequest, SchemaResponse } from '../src/app/common/models/server-models';

import * as api from './api';

/**
 * Contains paths of test files
 */
export const files = {
    squirrel: path.join(__dirname, 'files', 'squirrel.jpg')
};

/**
 * Checks if the current code is executed in a describe block.
 */
function inDescribe(): boolean {
    try {
        beforeAll(() => {});
        return true;
    } catch (err) {
        return false;
    }
}
interface WrapperFunctions<T extends object = object> {
    before(): T | Promise<T>;
    test(param: T): any;
    after(param: T): any;
}

interface ValueWrapperFunctions<T> {
    before(): any;
    test(): any;
    after(): any;
}

function createWrapper<T extends object>(fns: WrapperFunctions<T>) {
    return async () => {
        if (inDescribe()) {
            const val: T = {} as any;
            beforeAll(async () => {
                Object.assign(val, await fns.before());
            });

            afterAll(() => {
                return fns.after(val);
            });

            return fns.test(val);
        } else {
            const val = await fns.before();
            try {
                await fns.test(val);
            } finally {
                await fns.after(val);
            }
        }
    };
}

/**
 * Creates a schema for the test and deletes it afterwards.
 */
export function requiresSchema(schema: SchemaCreateRequest, body: (schema: SchemaResponse) => any) {
    return createWrapper({
        async before() {
            const response = await api.createSchema(schema);
            await api.assignSchemaToProject(response);
            return response;
        },
        test: body,
        after: api.deleteSchema
    });
}

/**
 * Creates a temporary folder in the root node of the project.
 * The folder and all its contents are deleted after the body has been executed.
 *
 * @param language The language of the created folder
 * @param body A function that is executed
 */
export function inTemporaryFolderWithLanguage(language: string, body: (folder: MeshNode) => any) {
    return createWrapper({
        async before() {
            const project = await api.getProject();
            return await api.createFolder(project.rootNode, 'tmpFolder' + uuid(), language);
        },
        test: body,
        after: api.deleteNode
    });
}

/**
 * Creates a temporary folder in the root node of the project.
 * The folder and all its contents are deleted after the body has been executed.
 *
 * @param body A function that is executed
 */
export function inTemporaryFolder(body: (folder: MeshNode) => any) {
    return inTemporaryFolderWithLanguage('en', body);
}

/**
 * Maps an Element from Protractor to its text. Useful for .map
 */
export function toText(element: ElementFinder | undefined) {
    return element!.getText();
}

/**
 * Retrieves the text of the first text node inside an element.
 * There is no other way in protractor to retrieve the text.
 * See https://stackoverflow.com/questions/32479422/how-do-i-get-the-text-of-a-nested-element-in-html-for-automation-using-selenium
 */
export function getTextNodeText(el: WebElement): Promise<string> {
    return browser.executeScript(function(elem: any) {
        const children = elem.childNodes;
        for (let i = 0; i < children.length; i++) {
            // 3 == TEXT_NODE
            if (children[i].nodeType === 3) {
                const trimmed = children[i].textContent.trim();
                if (trimmed.length > 0) {
                    return trimmed;
                }
            }
        }
    }, el) as any;
}

export async function assertNoConsoleErrors() {
    const logs = await browser
        .manage()
        .logs()
        .get('browser');
    expect(logs.length).toEqual(0);
}

/**
 * Reverts a node to its original state after the body has been executed.
 * @param uuid The uuid of the node to be reverted
 * @param body The function body to be executed.
 */
export async function temporaryNodeChanges(uuid: string, body: () => any) {
    const originalNode = await api.findNodeByUuid(uuid);
    try {
        await body();
    } finally {
        const alteredNode = await api.findNodeByUuid(uuid);
        await api.updateNode({
            ...originalNode,
            version: alteredNode.version
        });
    }
}

/**
 * Returns a function that resolves i18n keys to the english translation.
 * @param filename The filename of the i18n file. (e.g. editor)
 */
export function i18n(filename: string): (key: string) => string {
    const translation = require(`../src/app/core/providers/i18n/translations_json/${filename}.translations.json`);
    return (key: string) => translation[key].en;
}
