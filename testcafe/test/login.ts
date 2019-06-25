import { deleteUserByName } from '../api';
import { goToUsers } from '../page-object/admin/admin-main-menu';
import { createUser } from '../page-object/admin/user/user-detail';
import { newUser } from '../page-object/admin/user/user-list';
import { login } from '../page-object/login';
import { goToAdmin, logout, topBar } from '../page-object/topnav';
import { baseUrl } from '../testUtil';

fixture`Login`.page(baseUrl());

test('Change password on login', async t => {
    const username = `user-` + new Date().toISOString();

    await login('admin', 'admin');
    await goToAdmin();
    await goToUsers();
    await newUser();
    await createUser({
        userName: username,
        password: 'abc',
        forcedPasswordChange: true
    });
    t.ctx.username = username;
    await logout();
    await login(username, 'abc');
    await login(username, 'abc', 'newpassword');

    await t.expect(topBar.exists).ok('User is logged in');
}).after(async t => {
    if (t.ctx.username) {
        await deleteUserByName(t.ctx.username);
    }
});
