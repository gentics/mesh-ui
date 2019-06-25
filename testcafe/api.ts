import * as rp from 'request-promise';

import { UserListResponse } from '../src/app/common/models/server-models';

import { baseUrl } from './testUtil';

const api = rp.defaults({
    jar: rp.jar(),
    json: true,
    baseUrl: `${baseUrl()}/api/v1`
});

const login = api.post(`/auth/login`, {
    body: {
        username: 'admin',
        password: 'admin'
    }
});

export async function deleteUserByName(name: string) {
    await login;
    const users: UserListResponse = await api.get(`/users`);
    const uuid = users.data.filter(user => user.username === name)[0].uuid;
    await deleteUser(uuid);
}

export async function deleteUser(uuid: string) {
    await login;
    await api.delete(`/users/${uuid}`);
}
