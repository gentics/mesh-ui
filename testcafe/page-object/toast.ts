import { t, Selector } from 'testcafe';

export namespace toast {
    export async function expectErrorMessage(msg: string) {
        await t
            .expect(Selector('gtx-toast div.error').withText(msg).exists)
            .ok(`Expected toast error message containing "${msg}"`);
    }
}
