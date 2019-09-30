import { t } from 'testcafe';

import { HasUuid } from '../src/app/common/models/common.model';

export namespace navigate {
    export async function toNodeEdit(node: HasUuid, language = 'en') {
        await goToRoute(`/editor/project/(detail:demo/${node.uuid}/${language})`);
    }

    export async function toFolder(node: HasUuid, language = 'en') {
        await goToRoute(`/editor/project/(list:demo/${node.uuid}/${language})`);
    }

    export async function toGroupAdmin() {
        await goToRoute(`admin/groups`);
    }

    export async function toRoleAdmin() {
        await goToRoute(`admin/roles`);
    }

    export async function toProjectAdmin() {
        await goToRoute(`admin/projects`);
    }

    export async function toPermissionAdmin() {
        await goToRoute(`admin/permissions`);
    }

    /** @description Navigate to schema editor */
    export async function toAdminSchemaEditor() {
        await goToRoute(`admin/schemas`);
    }
    /** @description Navigate to schema editor in 'create new' mode with empty input fields */
    export async function toAdminSchemaEditorNew() {
        await goToRoute(`admin/schemas/new`);
    }
    /** @description Navigate to specified schema in schema editor */
    export async function toAdminSchemaEditorExistingSchema(schemaUuid: string) {
        await goToRoute(`admin/schemas/${schemaUuid}`);
    }

    /** @description Navigate to microschema editor */
    export async function toAdminMicroschemaEditor() {
        await goToRoute(`admin/microschemas`);
    }
    /** @description Navigate to microschema editor in 'create new' mode with empty input fields */
    export async function toAdminMicroschemaEditorNew() {
        await goToRoute(`admin/microschemas/new`);
    }
    /** @description Navigate to specified microschema in schema editor */
    export async function toAdminMicroschemaEditorExistingSchema(schemaUuid: string) {
        await goToRoute(`admin/microschemas/${schemaUuid}`);
    }
}

async function goToRoute(route: string) {
    await t.navigateTo(`/#${route}`);
}
