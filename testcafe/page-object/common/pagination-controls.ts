import { t, Selector } from 'testcafe';

export namespace paginationControls {
    export async function goToPage(page: number) {
        await t.click(Selector('.page-link a').withText(page.toString()));
    }

    export async function currentPage(): Promise<number> {
        return Number(await Selector('.page-link.current').textContent);
    }
}
