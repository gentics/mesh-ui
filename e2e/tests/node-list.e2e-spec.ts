import { createFolder, createVehicle, deleteNode, moveNode } from '../api';
import * as page from '../page-objects/app.po';
import * as nodeBrowser from '../page-objects/node-browser.po';
import * as editor from '../page-objects/node-editor.po';
import * as nodeList from '../page-objects/node-list.po';
import {
    assertNoConsoleErrors,
    awaitArray,
    inTemporaryFolder,
    inTemporaryFolderWithLanguage,
    toText
} from '../testUtil';

describe('node list', () => {
    beforeEach(async () => {
        await page.navigateToHome();
    });

    describe('breadcrumb', () => {
        it('displays only the project name in root node', async () => {
            const breadCrumbLinkTexts = awaitArray(nodeList.getBreadcrumbLinks().map(toText));
            expect(await breadCrumbLinkTexts).toEqual(['demo']);
        });

        it('displays only the project and a folder in a child node of the root node', async () => {
            await nodeList.getNode('Aircraft').openFolder();
            const breadCrumbLinkTexts = awaitArray(nodeList.getBreadcrumbLinks().map(toText));
            expect(await breadCrumbLinkTexts).toEqual(['demo', 'Aircraft']);
        });
    });

    describe('moving nodes', () => {
        it('displays correctly', async () => {
            await nodeList.getNode('Vehicle Images').openFolder();
            await nodeList.getNode('Ford GT Image').moveNode();
            await nodeBrowser
                .getBreadcrumbLinks()
                .get(0)
                .click();
            await nodeBrowser.choose();
            expect(await nodeList.getNode('Ford GT Image').isPresent()).toBeFalsy();
            await nodeList
                .getBreadcrumbLinks()
                .get(0)
                .click();
            expect(await nodeList.getNode('Ford GT Image').isPresent()).toBeTruthy();
            // Cleanup
            await moveNode({ uuid: 'df8beb3922c94ea28beb3922c94ea2f6' }, { uuid: '15d5ef7a9abf416d95ef7a9abf316d68' });
        });
    });

    describe('copying nodes', () => {
        it('works in the same folder', async () => {
            await nodeList.getNode('Yachts').copyNode();
            await nodeBrowser.choose();
            expect(await nodeList.getNode('Yachts (copy)').isPresent()).toBeTruthy();

            // Cleanup
            deleteNode({ uuid: await nodeList.getNode('Yachts (copy)').getNodeUuid() });
        });

        it('works in another folder', async () => {
            await nodeList.getNode('Yachts').copyNode();
            await nodeBrowser.openFolder('Aircraft');
            await nodeBrowser.choose();
            expect(await nodeList.getNode('Yachts (copy)').isPresent()).toBeFalsy();
            await nodeList.getNode('Aircraft').openFolder();
            expect(await nodeList.getNode('Yachts (copy)').isPresent()).toBeTruthy();

            // Cleanup
            deleteNode({ uuid: await nodeList.getNode('Yachts (copy)').getNodeUuid() });
        });
    });

    describe(
        'creating a node',
        inTemporaryFolderWithLanguage('de', folder => {
            it('works without content in default language', async () => {
                await nodeList.getNode(folder.fields.name).openFolder();
                await nodeList.createNode('folder');
                await assertNoConsoleErrors();
            });
        })
    );

    describe('deleting a node', () => {
        it(
            'closes the node editor if the deleted node was open',
            inTemporaryFolder(async folder => {
                const node1 = await createVehicle(folder, 'vehicle1');
                await page.navigateToFolder(folder);
                await nodeList.getNode(node1.displayName!).editNode();
                await nodeList.getNode(node1.displayName!).deleteNode();
                expect(await editor.isDisplayed()).toBe(false, 'Expected editor to be closed');
            })
        );

        it(
            'does not close the editor if another node was deleted',
            inTemporaryFolder(async folder => {
                const node1 = await createVehicle(folder, 'vehicle1');
                const node2 = await createVehicle(folder, 'vehicle2');
                await page.navigateToFolder(folder);
                await nodeList.getNode(node1.displayName!).editNode();
                await nodeList.getNode(node2.displayName!).deleteNode();
                expect(await editor.isDisplayed()).toBe(true, 'Expected editor to be open');
            })
        );
    });

    describe('Asserting existing node information', () => {
        it('shows existing languages correctly', async () => {
            await nodeList.getNode('Aircraft').openFolder();
            const nodeRow = nodeList.getNode('Space Shuttle');
            expect(await nodeRow.getLanguages()).toEqual(['en']);
        });

        it('shows existing tags correctly', async () => {
            await nodeList.getNode('Aircraft').openFolder();
            const nodeRow = nodeList.getNode('Space Shuttle');
            expect(await nodeRow.getTags()).toEqual(['Black', 'White', 'Hydrogen']);
        });
    });

    describe('Updating on changes', () => {
        it(
            'shows a newly created language of a node',
            inTemporaryFolder(async folder => {
                const node = await createVehicle(folder, 'vehicle1');
                await page.navigateToFolder(folder);
                const nodeRow = nodeList.getNode(node.displayName!);
                await nodeRow.editNode();
                await editor.createLanguage('de');
                expect(await nodeRow.getLanguages()).toEqual(['de', 'en']);
            })
        );

        it(
            'adds a tag to and removes a tag from a node',
            inTemporaryFolder(async folder => {
                const node = await createVehicle(folder, 'vehicle1');
                await page.navigateToFolder(folder);
                const nodeRow = nodeList.getNode(node.displayName!);
                await nodeRow.editNode();
                await editor.addTag('Black');
                await editor.save();
                expect(await nodeRow.getTags()).toEqual(['Black']);

                await editor.removeTag('Black');
                await editor.save();
                expect(await nodeRow.getTags()).toEqual([]);
            })
        );
    });

    describe(
        'pages correctly',
        inTemporaryFolder(folder => {
            beforeAll(async () => {
                for (let i = 0; i < 50; i++) {
                    await createFolder(folder, `test${i}`);
                }
            });

            beforeEach(async () => {
                await page.navigateToFolder(folder);
            });

            it('shows 8 items per page', async () => {
                expect(await nodeList.getNodes().count()).toBe(8);
            });

            it('shows 7 pages', async () => {
                expect(await nodeList.getPages().count()).toBe(7);
            });

            it('shows next page when clicked', async () => {
                const previousNode = await nodeList
                    .getNodes()
                    .get(0)
                    .getText();
                await nodeList
                    .getPages()
                    .get(1)
                    .click();
                expect(
                    await nodeList
                        .getNodes()
                        .get(0)
                        .getText()
                ).not.toEqual(previousNode);
            });
        })
    );
});
