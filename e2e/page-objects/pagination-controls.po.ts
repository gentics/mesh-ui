import { by, promise, ElementFinder } from 'protractor';

export class PaginationControls {
    constructor(private root: ElementFinder) {}

    public async displayedPages(): Promise<number[]> {
        const pages: ElementFinder[] = await this.root.all(by.css('.page-link'));
        const pageStr = await promise.all(pages.map(page => page.getText()));
        return pageStr.slice(1, pageStr.length - 1).map(Number);
    }
}
