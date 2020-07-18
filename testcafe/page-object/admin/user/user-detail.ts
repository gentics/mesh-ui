import testCafeFactory, { t, Selector } from 'testcafe';

import { formControlCheckbox, formControlInput } from '../../../testUtil';

export interface User {
    userName?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    forcedPasswordChange?: boolean;
    admin?: boolean;
}

export async function createUser(user: User) {
    const typeIfDefined = async (prop: string) => {
        if ((user as any)[prop]) {
            await t.typeText(formControlInput(prop), (user as any)[prop]);
        }
    };
    await typeIfDefined('userName');
    await typeIfDefined('password');
    await typeIfDefined('firstName');
    await typeIfDefined('lastName');
    await typeIfDefined('emailAddress');

    if (user.forcedPasswordChange) {
        await t.click(formControlCheckbox('forcedPasswordChange'));
    }

    await t.click(Selector('button').withText('CREATE USER'));
}
