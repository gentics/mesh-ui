import { browser } from 'protractor';

import * as api from '../api';
import * as page from '../page-objects/app.po';
import { HtmlField } from '../page-objects/html-field.po';
import * as nodeBrowser from '../page-objects/node-browser.po';
import * as editor from '../page-objects/node-editor.po';
import * as nodeList from '../page-objects/node-list.po';
import * as tooltip from '../page-objects/quill-tooltip.po';
import { files, inTemporaryFolder, temporaryNodeChanges } from '../testUtil';

fdescribe('node editor', () => {
    beforeAll(async () => {
        await page.navigateToHome();
    });

    describe('breadcrumbs', () => {
        it('correctly displayed', async () => {
            await page.navigateToNodeEdit({ uuid: 'f915b16fa68f40e395b16fa68f10e32d' });
            expect(await editor.getBreadCrumbText()).toBe('Aircraft › Space Shuttle');
        });
    });

    describe('html field in existing node', () => {
        let htmlField: HtmlField;
        const uuid = 'a5d81285b4884df1981285b488adf1b5';

        beforeEach(async () => {
            await page.navigateToNodeEdit({ uuid });
            htmlField = editor.getHtmlField('Description');
        });

        describe('node link', () => {
            it('creates a mesh link in the markup and removes it', async () => {
                // select text in Description text editor
                await htmlField.selectText('business');
                // click link to node button in Description text editor tools
                await htmlField.linkToNode();
                // select node 'Space Shuttle' from node list modal
                await nodeBrowser.getNode('Space Shuttle').select();
                // click button 'Choose' for in node list modal
                await nodeBrowser.choose();
                // click button 'Remove' in appearing tooltip popup of word business in Description text editor
                await editor.getRemoveNodeLink().click();
                // select text in Description text editor
                await htmlField.selectText('business');
                // click link to node button in Description text editor tools
                await htmlField.linkToNode();
                await browser.waitForAngular();
                const node = await api.findNodeByUuid(uuid);
                // confirm that no link exists
                expect(node.fields.description).toEqual(
                    'The Embraer Legacy 600 is a business jet derivative of the Embraer ERJ 145 family of commercial jet aircraft.'
                );
            });

            it('can be removed', async () => {
                // select text in Description text editor
                await htmlField.selectText('business');
                // click link to node button in Description text editor tools
                await htmlField.linkToNode();
                // select node 'Space Shuttle' from node list modal
                await nodeBrowser.getNode('Space Shuttle').select();
                // click button 'Choose' for in node list modal
                await nodeBrowser.choose();
                // select text in Description text editor
                await htmlField.clickAfter('busi');
                await tooltip.remove();
                await browser.waitForAngular();
                const node = await api.findNodeByUuid(uuid);
                // confirm that no link exists
                expect(node.fields.description).toEqual(
                    'The Embraer Legacy 600 is a business jet derivative of the Embraer ERJ 145 family of commercial jet aircraft.'
                );
            });

            it('creates external links that open in a new window', async () => {
                // select text in Description text editor
                await htmlField.selectText('business');
                // enter text into tooltip url link input and save it
                await htmlField.linkToUrl('http://example.org');

                await temporaryNodeChanges(uuid, async () => {
                    await editor.save();
                    await browser.waitForAngular();
                    const node = await api.findNodeByUuid(uuid);
                    expect(node.fields.description).toEqual(
                        '<p>The Embraer Legacy 600 is a <a href="http://example.org" target="_blank">business</a> jet derivative of the Embraer ERJ 145 family of commercial jet aircraft.</p>'
                    );
                });
            });

            it('creates internal links that open in the same window', async () => {
                // select text in Description text editor
                await htmlField.selectText('business');
                // click link to node button in Description text editor tools
                await htmlField.linkToNode();
                // select node 'Space Shuttle' from node list modal
                await nodeBrowser.getNode('Space Shuttle').select();
                // click button 'Choose' for in node list modal#
                await nodeBrowser.choose();
                await browser.waitForAngular();
                await temporaryNodeChanges(uuid, async () => {
                    await editor.save();
                    await browser.waitForAngular();
                    const node = await api.findNodeByUuid(uuid);
                    expect(node.fields.description).toEqual(
                        `<p>The Embraer Legacy 600 is a <a class="mesh-link" href="{{mesh.link('f915b16fa68f40e395b16fa68f10e32d')}}">business</a> jet derivative of the Embraer ERJ 145 family of commercial jet aircraft.</p>`
                    );
                });
            });
        });
    });

    describe('html field new node', () => {
        let htmlField: HtmlField;

        beforeEach(async () => {
            await page.navigateToHome();
            await nodeList.createNode('vehicle');
            htmlField = await editor.getHtmlField('Description');
        });

        describe('node link', () => {
            it('creates a mesh link in the markup', async () => {
                await htmlField.setText('Hello World!');
                await htmlField.selectText('World');
                await htmlField.linkToNode();
                await nodeBrowser.getNode('Automobiles').select();
                await nodeBrowser.choose();
                await editor.getRemoveNodeLink().click();
                await htmlField.selectText('World');
                await htmlField.linkToNode();
                expect(editor.getDescription()).toBe(
                    `The Embraer Legacy 600 is a business jet derivative of the Embraer ERJ 145 family of commercial jet aircraft.`
                );
            });
        });
    });

    describe(
        'image preview',
        inTemporaryFolder(folder => {
            it('shows the image if there is only content in a non-default langauge', async () => {
                const node = await api.createVehicleImage(folder, 'squirrel', 'de');
                await page.navigateToNodeEdit(node, 'de');
                const image = editor.getBinaryField('Image');
                await image.selectFile(files.squirrel);
                await editor.save();
                // Refresh the page
                await page.navigateToNodeEdit(node, 'de');
                expect(await image.isImageLoaded()).toBeTruthy();
            });
        })
    );
});
