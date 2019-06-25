import { t, Selector } from 'testcafe';

const mainMenu = Selector('ul.main-menu');

export async function goToUsers() {
    await t.click(mainMenu.find("a[routerlink='/admin/users']"));
}
