import { AppPage } from '../page-objects/app.po';
import { NodeField } from '../page-objects/node-field.po';

fdescribe('node field', () => {
    let page: AppPage;
    let nodeField: NodeField;

    beforeEach(async () => {
        page = new AppPage();
        nodeField = new NodeField();
        await page.navigateToHome();
    });

    it('should show the right node for vehicleImages', async () => {
        await nodeField.chooseVehicleImage();

        await expect(await nodeField.getPath().getText()).toEqual('demo › Vehicle Images › Space Shuttle Image');
    });
});
