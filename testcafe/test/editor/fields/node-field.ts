import { containerContents } from '../../../page-object/editor/container-contents';
import { nodeBrowser } from '../../../page-object/editor/node-browser/node-browser';
import { nodeEditor } from '../../../page-object/editor/node-editor';
import { login } from '../../../page-object/login';

// https://github.com/gentics/mesh-ui/issues/250
test('Choose node dialog usability', async t => {
    await login.loginAsAdmin();
    await containerContents.getListItemByName('Aircraft').open();
    await containerContents.getListItemByName('Space Shuttle').open();
    await nodeEditor.getNodeField('Vehicle Image').chooseNode();

    await t
        .expect(nodeBrowser.chooseButton.hasAttribute('disabled'))
        .ok('Choose button must be disabled if no node is chosen');

    await nodeBrowser.breadcrumbs.goTo('demo');
    await nodeBrowser.getNodeRow('Vehicle Images').open();

    const row = nodeBrowser.getNodeRow('Pelorus Image');
    await t.hover(row.element);

    await t.expect(row.checkBox.visible).ok('Checkbox must be visible when hovering row');
});
