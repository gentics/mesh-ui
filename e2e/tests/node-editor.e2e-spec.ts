import { AppPage } from '../page-objects/app.po';
import { NodeEditor } from '../page-objects/node-editor.po';

fdescribe('node editor', () => {
    let page: AppPage;
    let editor: NodeEditor;

    beforeAll(async () => {
        console.log('before All!');
        page = new AppPage();
        editor = new NodeEditor();
        await page.navigateToHome();
        console.log('navigated...');
    });

    it('shows the breadcrumb correctly', async () => {
        console.log('test');
        await page.navigateToNodeEdit({ uuid: 'f915b16fa68f40e395b16fa68f10e32d' });
        expect(await editor.getBreadCrumbText()).toBe('Aircraft › Space Shuttle');
    });
});
