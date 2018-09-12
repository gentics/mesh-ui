import { AppPage } from '../page-objects/app.po';
import * as actions from '../page-objects/node-actions.po';
import { NodeEditor } from '../page-objects/node-editor.po';
import { i18n } from '../testUtil';

describe('node publishing', () => {
    let page: AppPage;
    let editor: NodeEditor;

    beforeAll(async () => {
        page = new AppPage();
        editor = new NodeEditor();
        await page.navigateToHome();
    });

    beforeEach(async () => {
        // Navigate to Aircraft / Gulfstream G550
        await page.navigateToNodeEdit({ uuid: '7354bf2362e245cf94bf2362e235cf24' });
    });

    it('shows only available options when published', async () => {
        const options = await actions.getPublishOptions();
        expect(options).toEqual(['unpublish', 'unpublish_all'].map(i18n('editor')));
    });

    it('shows only available options when unpublished', async () => {
        await actions.unpublish();
        expect(await actions.getPublishOptions()).toEqual(['publish_button', 'publish_all'].map(i18n('editor')));
        await actions.publish();
        expect(await actions.getPublishOptions()).toEqual(['unpublish', 'unpublish_all'].map(i18n('editor')));
    });
});
