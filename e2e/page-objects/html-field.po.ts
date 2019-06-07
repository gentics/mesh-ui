import { browser, by, ElementFinder, Key } from 'protractor';

export class HtmlField {
    editor: ElementFinder;
    toolbar: ElementFinder;
    constructor(private container: ElementFinder) {
        this.editor = container.element(by.css('.ql-editor'));
        this.toolbar = container.element(by.css('.ql-toolbar'));
    }

    linkToNode() {
        return this.toolbar.element(by.css('.ql-mesh-link')).click();
    }

    removeFormat() {
        return this.toolbar.element(by.css('.ql-clean')).click();
    }

    clickAfter(text: string) {
        return this.selectText(text, true);
    }

    setText(text: string) {
        return this.editor.sendKeys(Key.CONTROL, 'a', Key.NULL, text);
    }

    /**
     * Selects the whole text in the html field.
     */
    async selectText(): Promise<void>;
    /**
     * Selects text in the html field.
     */
    async selectText(text: string): Promise<void>;
    /**
     * Puts the caret after the text, if caretOnly is true
     */
    async selectText(text: string, caretOnly: boolean): Promise<void>;
    async selectText(text?: string, caretOnly = false): Promise<void> {
        await browser.executeScript(
            (element: HTMLElement, text: string, caretOnly: boolean) => {
                let n;
                const textNodes = [];
                const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
                while ((n = walk.nextNode())) {
                    textNodes.push(n);
                }

                const range = document.createRange();

                if (text) {
                    const node = textNodes.find(it => it.textContent!.includes(text))!;
                    const textIndex = node.textContent!.indexOf(text);
                    if (caretOnly) {
                        range.setStart(node, textIndex + text.length);
                    } else {
                        range.setStart(node, textIndex);
                    }
                    range.setEnd(node, textIndex + text.length);
                } else {
                    const lastNode = textNodes[textNodes.length - 1];
                    range.setStart(textNodes[0], 0);
                    range.setEnd(lastNode, lastNode.textContent!.length - 1);
                }

                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    throw new Error('window.getSelection() returned null');
                }
            },
            await this.editor,
            text,
            caretOnly
        );
    }

    /**
     * Creates a link for the selected text.
     */
    async linkToUrl(url: string) {
        await this.toolbar.element(by.css('.ql-link')).click();
        const inputUrl = await this.container.element(by.css('.ql-tooltip.ql-editing input'));
        await inputUrl.clear();
        await inputUrl.sendKeys(Key.CONTROL, 'a', Key.NULL, url);
        await this.container.element(by.css('.ql-tooltip.ql-editing .ql-action')).click();
    }
}
