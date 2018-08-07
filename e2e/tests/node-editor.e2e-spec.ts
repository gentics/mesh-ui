import { by } from 'protractor';

import * as api from '../api';
import { AppPage } from '../page-objects/app.po';
import { HtmlField } from '../page-objects/html-field.po';
import * as nodeBrowser from '../page-objects/node-browser.po';
import { NodeEditor } from '../page-objects/node-editor.po';
import * as tooltip from '../page-objects/quill-tooltip.po';
import { getTextNodeText } from '../testUtil';

describe('node editor', () => {
    let page: AppPage;
    let editor: NodeEditor;

    beforeAll(async () => {
        page = new AppPage();
        editor = new NodeEditor();
        await page.navigateToHome();
    });

    it('shows the breadcrumb correctly', async () => {
        await page.navigateToNodeEdit({ uuid: 'f915b16fa68f40e395b16fa68f10e32d' });
        expect(await editor.getBreadCrumbText()).toBe('Aircraft › Space Shuttle');
    });

    describe('html field', () => {
        let htmlField: HtmlField;
        const uuid = 'a5d81285b4884df1981285b488adf1b5';

        beforeEach(async () => {
            await page.navigateToNodeEdit({ uuid });
            htmlField = editor.getHtmlField('Description');
        });

        describe('node link', () => {
            it('creates a mesh link in the markup', async () => {
                await htmlField.selectText('business');
                await htmlField.linkToNode();
                await nodeBrowser.getNode('Space Shuttle').select();
                await nodeBrowser.choose();
                await editor.getRemoveNodeLink().click();
                await htmlField.selectText('business');
                await htmlField.linkToNode();
                expect(editor.getDescription()).toBe(
                    `The Embraer Legacy 600 is a business jet derivative of the Embraer ERJ 145 family of commercial jet aircraft.`
                );
            });

            it('can be removed', async () => {
                await htmlField.selectText('business');
                await htmlField.linkToNode();
                await nodeBrowser.getNode('Space Shuttle').select();
                await nodeBrowser.choose();
                await htmlField.clickAfter('busi');
                await tooltip.remove();
                expect(await htmlField.editor.element(by.tagName('a')).isPresent()).toBeFalsy();
            });
        });
    });
});
