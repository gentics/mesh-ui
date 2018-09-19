import { by } from 'protractor';

import { createFolder, createVehicle } from '../api';
import * as api from '../api';
import * as page from '../page-objects/app.po';
import * as browser from '../page-objects/node-browser.po';
import { NodeField } from '../page-objects/node-field.po';
import * as nodeList from '../page-objects/node-list.po';
import { inTemporaryFolder, inTemporaryFolderWithLanguage, toText } from '../testUtil';

describe('node browser', () => {
    let nodeField: NodeField;

    beforeAll(async () => {
        nodeField = new NodeField();
    });

    describe('demo data', () => {
        beforeAll(async () => {
            await page.navigateToHome();
            await nodeList.openFolder('Automobiles');
            await nodeList.editNode('Ford GT');
            await nodeField.clickBrowse();
        });

        it('shows breadcrumbs of current folder', async () => {
            const expected = ['demo', 'Automobiles'];
            const breadcrumbs = browser.getBreadcrumbLinks();
            expect(await breadcrumbs.map(toText)).toEqual(expected);
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
            const nodes = browser.getNodesOnlyNames();
            expect(await nodes.map(toText)).toEqual(expected);
        });

        it('does not show pagination for a single page', async () => {
            const pages = browser.getPages();
            expect(await pages.count()).toBe(0);
        });

        it('can only select one node', async () => {
            await browser
                .getBreadcrumbLinks()
                .get(0)
                .click();
            await browser.openFolder('Vehicle Images');

            const checkboxes = browser.getNodes().all(by.tagName('gtx-checkbox'));
            await checkboxes.get(0).click();
            expect(
                await checkboxes
                    .get(0)
                    .element(by.tagName('input'))
                    .isSelected()
            ).toBeTruthy();
            await checkboxes.get(1).click();
            expect(
                await checkboxes
                    .get(0)
                    .element(by.tagName('input'))
                    .isSelected()
            ).toBeFalsy();
            await checkboxes.get(1).click();
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
                expect(await browser.getNodes().count()).toBe(10);
            });

            it('shows 6 pages', async () => {
                expect(await browser.getPages().count()).toBe(6);
            });

            it('shows next page when clicked', async () => {
                const previousNode = await browser
                    .getNodes()
                    .get(0)
                    .getText();
                await browser
                    .getPages()
                    .get(1)
                    .click();
                expect(
                    await browser
                        .getNodes()
                        .get(0)
                        .getText()
                ).not.toEqual(previousNode);
            });
        })
    );

    describe('search', () => {
        beforeAll(async () => {
            await page.navigateToHome();
            await nodeList.openFolder('Automobiles');
            await nodeList.editNode('Ford GT');
            await nodeField.clickBrowse();
        });

        it('displays results correctly', async () => {
            await browser.search('ford');
            const result = await browser.getNodesOnlyNames().map(toText);
            expect(result[0]).toBe('Ford GT');
            expect(result[1]).toBe('Ford GT Image');
        });

        it('pages correctly', async () => {
            await browser.search('folder');

            const previousNode = await browser
                .getNodes()
                .get(0)
                .getText();

            await browser
                .getNodeLinks()
                .get(0)
                .click();

            expect(
                await browser
                    .getNodes()
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
                await nodeList.openFolder('Automobiles');
                await nodeList.editNode('Ford GT');
                await nodeField.clickBrowse();
            });

            it('shows nodes in non-default languages', async () => {
                await browser.goToRoot();
                await browser.openFolder(folder.displayName!);
                await browser.getNode('germanImage').select();
                await browser.choose();
            });
        })
    );
});
