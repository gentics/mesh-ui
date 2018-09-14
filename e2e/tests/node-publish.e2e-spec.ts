import { AppPage } from '../page-objects/app.po';
import * as actions from '../page-objects/node-actions.po';
import { NodeEditor } from '../page-objects/node-editor.po';
import { i18n } from '../testUtil';
import { nodes } from '../uuids';

describe('node publishing', () => {
    let page: AppPage;
    let editor: NodeEditor;

    beforeAll(async () => {
        page = new AppPage();
        editor = new NodeEditor();
        await page.navigateToHome();
    });

    beforeEach(async () => {
        await page.navigateToNodeEdit({ uuid: nodes.Aircraft.GulfstreamG550 });
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
