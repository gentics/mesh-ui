import { t, Selector } from 'testcafe';

export type AdminMenuEntry = 'Projects' | 'Users' | 'Groups' | 'Roles' | 'Permissions' | 'Schemas' | 'Microschemas';

export namespace adminMainMenu {
    export async function goTo(entry: AdminMenuEntry) {
        await t.click(Selector('.main-menu li a').withText(entry));
    }
}
