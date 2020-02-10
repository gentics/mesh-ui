import { api } from '../../../api';
import { containerContents } from '../../../page-object/editor/container-contents';
import { nodeBrowser } from '../../../page-object/editor/node-browser/node-browser';
import { nodeEditor } from '../../../page-object/editor/node-editor';
import { login } from '../../../page-object/login';
import { inTemporaryFolder } from '../../../testUtil';

fixture`Node Field`.page(api.baseUrl());

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

// https://github.com/gentics/mesh-ui/issues/284
/**
 * We expect to see referenced node images in the following priority:
 *
 * * Image in the same language of the original node
 * * Generic file icon
 */
test('Preview image for non-default language', async t =>
    inTemporaryFolder(async parent => {
        const noImages = await api.createVehicleImage(parent, 'noImages');
        const englishOnly = await api.createVehicleImage(parent, 'englishOnly');
        const germanOnly = await api.createVehicleImage(parent, 'germanOnly', 'de');
        const bothLanguages = await api.createVehicleImage(parent, 'bothLanguages');
        await api.createVehicleImageLanguage(bothLanguages, 'bothLanguages', 'de');
        await api.uploadVehicleImage(englishOnly, 'englishOnly.jpg', 'en');
        await api.uploadVehicleImage(germanOnly, 'germanOnly.jpg', 'de');
        await api.uploadVehicleImage(bothLanguages, 'bothDe.jpg', 'de');
        await api.uploadVehicleImage(bothLanguages, 'bothEn.jpg', 'en');
        await api.createVehicle(parent, 'testVehicle');

        await login.loginAsAdmin();
        await containerContents.getListItemByName(parent.fields.name).open();
        await containerContents.getListItemByName('testVehicle').open();
        const chooseImage = async (imageName: string) => {
            nodeEditor.getNodeField('Vehicle Image').chooseNode();
            await nodeBrowser.breadcrumbs.goTo('demo');
            await nodeBrowser.getNodeRow(parent.fields.name).open();
            await nodeBrowser.getNodeRow(imageName).choose();
            await nodeBrowser.choose();
        };

        const thumbnail = nodeEditor.getNodeField('Vehicle Image').thumbnail();
        const thumbnailLang = async () => new URL(await thumbnail.imageUrl()).searchParams.get('lang');

        // English

        await chooseImage('noImages');
        await t.expect(await thumbnail.showsImage()).eql(false);

        await chooseImage('englishOnly');
        await t.expect(await thumbnailLang()).eql('en');

        await chooseImage('germanOnly');
        await t.expect(await thumbnail.showsImage()).eql(false);

        await chooseImage('bothLanguages');
        await t.expect(await thumbnailLang()).eql('en');

        // German

        await nodeEditor.createLanguageVersion('German');

        await chooseImage('noImages');
        await t.expect(await thumbnail.showsImage()).eql(false);

        await chooseImage('englishOnly');
        await t.expect(await thumbnail.showsImage()).eql(false);

        await chooseImage('germanOnly');
        await t.expect(await thumbnailLang()).eql('de');

        await chooseImage('bothLanguages');
        await t.expect(await thumbnailLang()).eql('de');
    }));
