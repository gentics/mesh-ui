import { t, Selector } from 'testcafe';

import { formControlInput } from '../testUtil';

export async function login(username: string, password: string, newPassword?: string) {
    await t
        .typeText(formControlInput('username'), username, { replace: true })
        .typeText(formControlInput('password'), password, { replace: true });
    if (newPassword) {
        await t
            .typeText(formControlInput('newPassword'), newPassword, { replace: true })
            .typeText(formControlInput('newPasswordRepeat'), newPassword, { replace: true });
    }
    await t.click(Selector('button').withExactText('LOG IN'));
}
