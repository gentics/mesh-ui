import { t, Selector } from 'testcafe';

export async function newUser() {
    await t.click(Selector('button').withText('NEW USER'));
}
