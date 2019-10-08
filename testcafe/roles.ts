import { Role } from 'testcafe';

import { api } from './api';
import { containerContents } from './page-object/editor/container-contents';
import { login } from './page-object/login';

export const Admin = Role(
    `${api.baseUrl()}/#/login`,
    async t => {
        await login('admin', 'admin');
        await containerContents.expectVisible();
    },
    {
        preserveUrl: false
    }
);
