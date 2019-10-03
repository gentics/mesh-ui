import { Role } from 'testcafe';

import { api } from '../api';
import { goToUsers } from '../page-object/admin/admin-main-menu';
import { createUser } from '../page-object/admin/user/user-detail';
import { newUser } from '../page-object/admin/user/user-list';
import { containerContents } from '../page-object/editor/container-contents';
import { login } from '../page-object/login';
import { toast } from '../page-object/toast';
import { topnav } from '../page-object/topnav';
import { Admin } from '../roles';

fixture`Login`.page(api.baseUrl());

test('Change password on login', async t => {
    const username = `user-` + new Date().toISOString();

    await t.useRole(Role.anonymous());

    await login('admin', 'admin');
    await topnav.goToAdmin();
    await goToUsers();
    await newUser();
    await createUser({
        userName: username,
        password: 'abc',
        forcedPasswordChange: true
    });
    t.ctx.username = username;
    await topnav.logout();
    await login(username, 'abc');
    await login(username, 'abc', 'newpassword');

    await t.expect(topnav.topBar.exists).ok('User is logged in');

    // TODO Use Roles to switch more
    await topnav.logout();
    await login('admin', 'admin');
}).after(async t => {
    if (t.ctx.username) {
        await api.deleteUserByName(t.ctx.username);
    }
});

test('Invalid credentials', async t => {
    await t.useRole(Role.anonymous());
    await login('admin', 'invalid');
    await toast.expectErrorMessage('Login failed.');
});

test('Home button', async t => {
    await t.useRole(Admin);
    await topnav.goToAdmin();
    await topnav.goHome();

    await containerContents.expectVisible();
});
