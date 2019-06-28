import { Role } from 'testcafe';

import { api } from './api';
import { login } from './page-object/login';

export const Admin = Role(`${api.baseUrl()}/#/login`, async t => {
    await login('admin', 'admin');
});
