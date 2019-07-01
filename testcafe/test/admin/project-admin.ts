import { Selector } from 'testcafe';

import { api } from '../../api';
import { assert } from '../../assert';
import { navigate } from '../../navigate';
import { projectList } from '../../page-object/admin/project/project-list';
import { Admin } from '../../roles';

fixture`Project administration`.page(api.baseUrl());

const projectName = 'testProject';
test('Create project with anonymous permissions', async t => {
    await t.useRole(Admin);
    await navigate.toProjectAdmin();
    await projectList.createProject({ name: projectName });
    await api.asAnonymousUser(async () => {
        // Should be successful because it is readable
        await api.getProjectByName(projectName);
    });
}).after(async t => {
    await api.deleteProjectByName(projectName);
});

test('Create project without anonymous permissions', async t => {
    await t.useRole(Admin);
    await navigate.toProjectAdmin();
    await projectList.createProject({ name: projectName, anonymousAccess: false });
    await api.asAnonymousUser(async () => {
        try {
            await api.getProjectByName(projectName);
            await assert.fail('The anonymous user should not have access to the project');
        } catch (err) {
            await t.expect(err.statusCode).eql(403);
        }
    });
}).after(async t => {
    await api.deleteProjectByName(projectName);
});
