import { t, Selector } from 'testcafe';

export namespace topnav {
    export const topBar = Selector('gtx-top-bar');

    export async function goToAdmin() {
        await t.click(topBar.find('button').withExactText('ADMIN'));
    }

    export async function logout() {
        await openSidebar();
        await t.click(Selector('gtx-side-menu gtx-button').withText('LOG OUT'));
    }

    export async function goHome() {
        await t.click('gtx-top-bar a.logo-container');
    }
}

async function openSidebar() {
    await t.click('gtx-side-menu-toggle gtx-button');
}
