import { AppPage } from '../page-objects/app.po';
import { MeshNodeList } from '../page-objects/node-list.po';
import { toText } from '../testUtil';

describe('node list', () => {
    let page: AppPage;
    let nodeList: MeshNodeList;

    beforeEach(async () => {
        page = new AppPage();
        nodeList = new MeshNodeList();
        await page.navigateToHome();
    });

    describe('breadcrumb', () => {
        it('displays only the project name in root node', async () => {
            expect(await nodeList.getBreadcrumbLinks().map(toText)).toEqual(['demo']);
        });

        it('displays only the project and a folder in a child node of the root node', async () => {
            await nodeList.openFolder('Aircraft');
            expect(await nodeList.getBreadcrumbLinks().map(toText)).toEqual(['demo', 'Aircraft']);
        });
    });
});
