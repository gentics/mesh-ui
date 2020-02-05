import { t, Selector } from 'testcafe';

export namespace paginationControls {
    const parent = Selector('mesh-pagination-controls');
    export async function goToPage(page: number) {
        await t.click(parent.find('.page-link a').withText(page.toString()));
    }

    export async function currentPage(): Promise<number> {
        return Number(await parent.find('.page-link.current').textContent);
    }

    export async function exists() {
        return parent.exists;
    }
}
