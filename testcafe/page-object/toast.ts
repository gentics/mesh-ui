import { t, Selector } from 'testcafe';

export namespace toast {
    export async function expectErrorMessage(msg: string) {
        return expectMessage(msg, 'error');
    }

    export async function expectSuccessMessage(msg: string) {
        return expectMessage(msg, 'success');
    }

    async function expectMessage(msg: string, type: string) {
        await t
            .expect(Selector(`gtx-toast div.${type}`).withText(msg).exists)
            .ok(`Expected toast ${type} message containing "${msg}"`);
    }
}
