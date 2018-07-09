import { by } from 'protractor';

import { createFolder, createVehicle } from './api';
import { AppPage } from './app.po';
import { NodeBrowserDialog } from './nodebrowser.po';
import { temporaryFolder } from './testUtil';

describe('node browser', () => {
    let page: AppPage;
    let browser: NodeBrowserDialog;

    beforeAll(async () => {
        page = new AppPage();
        browser = new NodeBrowserDialog();
    });

    describe('demo data', () => {
        beforeAll(async () => {
            await page.navigateToHome();
            await page.openFolder('Automobiles');
            await page.editNode('Ford GT');
            await page.chooseNodeReference('Vehicle Image');
        });

        it('shows breadcrumbs of current folder', async () => {
            const expected = ['demo', 'Automobiles'];
            const breadcrumbs = browser.getBreadcrumbLinks();
            expect(await breadcrumbs.map(node => node!.getText())).toEqual(expected);
        });

        it('shows contents of the folder', async () => {
            const expected = [
                'Koenigsegg CCX',
                'Tesla Roadster',
                'Ford GT',
                'DeLorean DMC-12',
                'Maize Blue Solar Car',
                'Trabant'
            ];
            const nodes = browser.getNodes();
            expect(await nodes.map(node => node!.getText())).toEqual(expected);
        });

        it('does not show pagination for a single page', async () => {
            const pages = browser.getPages();
            expect(await pages.count()).toBe(0);
        });

        it('can only select one node', async () => {
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

    temporaryFolder('paging', context => {
        beforeAll(async () => {
            const vehicle = await createVehicle(context.folder, 'testVehicle');
            for (let i = 0; i < 50; i++) {
                await createFolder(context.folder, `test${i}`);
            }
            await page.navigateToNodeEdit(vehicle);
            await page.chooseNodeReference('Vehicle Image');
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
    });
});
