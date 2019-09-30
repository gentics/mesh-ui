import { t, Selector } from 'testcafe';

export namespace permissionsRoleList {
    export async function chooseRole(name: string) {
        await t.click(Selector('a').withText(name));
    }
}
