import { Role } from 'testcafe';

import { api } from '../api';
import { adminMainMenu } from '../page-object/admin/admin-main-menu';
import { createUser } from '../page-object/admin/user/user-detail';
import { newUser } from '../page-object/admin/user/user-list';
import { containerContents } from '../page-object/editor/container-contents';
import { login } from '../page-object/login';
import { toast } from '../page-object/toast';
import { topnav } from '../page-object/topnav';

fixture`Login`.page(api.baseUrl());

test('Change password on login', async t => {
    const username = `user-` + new Date().toISOString();

    await login.login('admin', 'admin');
    await topnav.goToAdmin();
    await adminMainMenu.goTo('Users');
    await newUser();
    await createUser({
        userName: username,
        password: 'abc',
        forcedPasswordChange: true
    });
    t.ctx.username = username;
    await topnav.logout();
    await login.login(username, 'abc');
    await login.login(username, 'abc', 'newpassword');

    await t.expect(topnav.topBar.exists).ok('User is logged in');

    // TODO Use Roles to switch more
    await topnav.logout();
    await login.login('admin', 'admin');
}).after(async t => {
    if (t.ctx.username) {
        await api.deleteUserByName(t.ctx.username);
    }
});

test('Invalid credentials', async t => {
    await login.login('admin', 'invalid');
    await toast.expectErrorMessage('Login failed.');
});

test('Home button', async t => {
    await login.loginAsAdmin();
    await topnav.goToAdmin();
    await topnav.goHome();

    await containerContents.expectVisible();
});
