import { browser, by } from 'protractor';

import { createFolder, createVehicle } from '../api';
import * as api from '../api';
import * as page from '../page-objects/app.po';
import * as MeshBrowser from '../page-objects/node-browser.po';
import { NodeField } from '../page-objects/node-field.po';
import * as nodeList from '../page-objects/node-list.po';
import { awaitArray, inTemporaryFolder, inTemporaryFolderWithLanguage, toText } from '../testUtil';

describe('node browser', () => {
    let nodeField: NodeField;

    beforeAll(async () => {
        nodeField = new NodeField();
    });

    describe('demo data', () => {
        beforeAll(async () => {
            await page.navigateToHome();
            await nodeList.getNode('Automobiles').openFolder();
            await nodeList.getNode('Ford GT').editNode();
            await nodeField.clickBrowse();
        });

        it('shows breadcrumbs of current folder', async () => {
            const expected = ['demo', 'Automobiles'];
            const breadCrumbTexts = awaitArray(MeshBrowser.getBreadcrumbLinks().map(toText));
            expect(breadCrumbTexts).toEqual(expected);
        });

        it('shows contents of the folder', async () => {
            const expected = [
                'Tesla Roadster',
                'Ford GT',
                'DeLorean DMC-12',
                'Maize Blue Solar Car',
                'Trabant',
                'Koenigsegg CCX'
            ];
            const nodes = awaitArray(MeshBrowser.getNodesOnlyNames().map(toText));
            expect(nodes).toEqual(expected);
        });

        it('does not show pagination for a single page', async () => {
            const pages = MeshBrowser.getPages();
            expect(await pages.count()).toBe(0);
        });

        it('can only select one node', async () => {
            await MeshBrowser.getBreadcrumbLinks()
                .get(0)
                .click();
            await MeshBrowser.openFolder('Vehicle Images');
            await browser.waitForAngular();

            const checkboxes = MeshBrowser.getNodes().all(by.tagName('gtx-checkbox'));
            await checkboxes.get(0).click();
            await browser.waitForAngular();
            expect(
                await checkboxes
                    .get(0)
                    .element(by.tagName('input'))
                    .isSelected()
            ).toBeTruthy();
            await checkboxes.get(1).click();
            await browser.waitForAngular();
            expect(
                await checkboxes
                    .get(0)
                    .element(by.tagName('input'))
                    .isSelected()
            ).toBeFalsy();
            await checkboxes.get(1).click();
            await browser.waitForAngular();
            expect(
                await checkboxes
                    .get(1)
                    .element(by.tagName('input'))
                    .isSelected()
            ).toBeFalsy();
        });
    });

    describe(
        'paging',
        inTemporaryFolder(folder => {
            beforeAll(async () => {
                const vehicle = await createVehicle(folder, 'testVehicle');
                for (let i = 0; i < 50; i++) {
                    await createFolder(folder, `test${i}`);
                }
                await page.navigateToNodeEdit(vehicle);
                await nodeField
                    .getSelectButton()
                    .get(0)
                    .click();
            });

            it('shows 10 items per page', async () => {
                expect(await MeshBrowser.getNodes().count()).toBe(10);
            });

            it('shows 6 pages', async () => {
                expect(await MeshBrowser.getPages().count()).toBe(6);
            });

            it('shows next page when clicked', async () => {
                const previousNode = await MeshBrowser.getNodes()
                    .get(0)
                    .getText();
                await MeshBrowser.getPages()
                    .get(1)
                    .click();
                expect(
                    await MeshBrowser.getNodes()
                        .get(0)
                        .getText()
                ).not.toEqual(previousNode);
            });
        })
    );

    describe('search', () => {
        beforeAll(async () => {
            await page.navigateToHome();
            await nodeList.getNode('Automobiles').openFolder();
            await nodeList.getNode('Ford GT').editNode();
            await nodeField.clickBrowse();
        });

        it('displays results correctly', async () => {
            await MeshBrowser.search('ford');
            const result = await MeshBrowser.getNodesOnlyNames().map(toText);
            expect(result[0]).toBe('Ford GT');
            expect(result[1]).toBe('Ford GT Image');
        });

        it('pages correctly', async () => {
            await MeshBrowser.search('folder');

            const previousNode = await MeshBrowser.getNodes()
                .get(0)
                .getText();

            await MeshBrowser.getNodeLinks()
                .get(0)
                .click();

            expect(
                await MeshBrowser.getNodes()
                    .get(0)
                    .getText()
            ).not.toEqual(previousNode);
        });
    });

    describe(
        'languages',
        inTemporaryFolderWithLanguage('de', folder => {
            beforeAll(async () => {
                await api.createVehicleImage(folder, 'germanImage', 'de');
                await page.navigateToHome();
                await nodeList.getNode('Automobiles').openFolder();
                await nodeList.getNode('Ford GT').editNode();
                await nodeField.clickBrowse();
            });

            it('shows nodes in non-default languages', async () => {
                await MeshBrowser.goToRoot();
                await MeshBrowser.openFolder(folder.displayName!);
                await MeshBrowser.getNode('germanImage').select();
                await MeshBrowser.choose();
            });
        })
    );
});
