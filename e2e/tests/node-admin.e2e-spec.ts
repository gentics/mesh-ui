import * as page from '../page-objects/app.po';
import { NodeAdmin } from '../page-objects/node-admin.po';

describe('node admin', () => {
    let admin: NodeAdmin;

    beforeEach(async () => {
        admin = new NodeAdmin();
        await page.navigateToHome();
    });

    it('shows the mode correctly', async () => {
        await admin.modeChange();
        await expect(admin.getModeText()).toEqual('EDITOR MODE');
    });
});
