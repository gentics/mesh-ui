import * as page from '../page-objects/app.po';
import * as actions from '../page-objects/node-actions.po';
import { i18n } from '../testUtil';
import { nodes } from '../uuids';

describe('node publishing', () => {
    beforeAll(async () => {
        await page.navigateToHome();
    });

    beforeEach(async () => {
        await page.navigateToNodeEdit({ uuid: nodes.Aircraft.GulfstreamG550 });
    });

    it('shows only available options when published', async () => {
        const options = await actions.getPublishOptions();
        expect(options).toEqual(['unpublish', 'unpublish_all_lang'].map(i18n('editor')));
    });

    it('shows only available options when unpublished', async () => {
        await actions.unpublish();
        expect(await actions.getPublishOptions()).toEqual(['publish_button', 'publish_all_lang'].map(i18n('editor')));
        await actions.publish();
        expect(await actions.getPublishOptions()).toEqual(['unpublish', 'unpublish_all_lang'].map(i18n('editor')));
    });
});
