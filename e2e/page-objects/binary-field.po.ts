import { browser, by, ElementFinder } from 'protractor';

export class BinaryField {
    constructor(private container: ElementFinder) {}

    async selectFile(path: string) {
        const element = await this.container.element(by.css('.hidden-file-input'));
        return element.sendKeys(path);
    }

    async isImageLoaded(): Promise<boolean> {
        const image = await this.container.element(by.css('gentics-ui-image-preview img')).getWebElement();
        await browser.waitForAngular();
        await browser.sleep(1000);
        return browser.executeScript((element: HTMLImageElement) => {
            return element.naturalWidth > 0;
        }, image) as any;
    }
}
