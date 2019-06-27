import { Role } from 'testcafe';

import { login } from './page-object/login';
import { baseUrl } from './testUtil';

export const Admin = Role(`${baseUrl()}/#/login`, async t => {
    await login('admin', 'admin');
});
