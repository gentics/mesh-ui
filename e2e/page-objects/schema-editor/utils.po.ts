import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

import { awaitArray } from '../../testUtil';

export namespace SchemaEditorUtils {
    export function getInputElementByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] input`);
        if (rootElement) {
            return rootElement.element(target);
        } else {
            return element(target);
        }
    }

    export function getInputSelectElementByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] gtx-dropdown-trigger`);
        if (rootElement) {
            return rootElement.element(target);
        } else {
            return element(target);
        }
    }

    export function getInputValueByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] input`);
        let el: ElementFinder;
        if (rootElement) {
            el = rootElement.element(target);
        } else {
            el = element(target);
        }
        return el.getAttribute('value');
    }

    export async function getInputCheckboxValueByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] input`);
        let el: ElementFinder;
        if (rootElement) {
            el = rootElement.element(target);
        } else {
            el = element(target);
        }

        const value = await el.getAttribute('checked');

        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        } else {
            return null;
        }
    }

    export function getInputSelectSingleValueByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] .view-value > div`);
        let el: ElementFinder;
        if (rootElement) {
            el = rootElement.element(target);
        } else {
            el = element(target);
        }
        return el.getText();
    }

    export async function getInputSelectMultiValueByFormControlName(
        formControlName: string,
        rootElement?: ElementFinder
    ) {
        const target = by.css(`[formControlName="${formControlName}"] .view-value > div`);
        let el: ElementFinder;
        if (rootElement) {
            el = rootElement.element(target);
        } else {
            el = element(target);
        }
        const values = await el.getText();
        values.replace(/\s/g, '');
        return values.split(new RegExp(/,/)).map(item => item.replace(/\s/g, ''));
    }

    export async function getInputErrorsByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] + .input-note p`);
        let els: ElementArrayFinder;
        if (rootElement) {
            els = rootElement.all(target);
        } else {
            els = element.all(target);
        }
        return awaitArray(els.map(item => item!.getText()));
    }

    /**
     * @description Anytime a input select has been clicked a globale dropdown menu with its available options will be opened.
     * @returns strings contained in dropdown menu items IF expanded
     * */
    function getSelectableOptions(rootElement?: ElementFinder): Promise<string[]> {
        const target = by.css('gtx-dropdown-content-wrapper .select-option');
        let els: ElementArrayFinder;
        if (rootElement) {
            els = rootElement.all(target);
        } else {
            els = element.all(target);
        }
        return awaitArray(els.map(item => item!.getText()));
    }

    export async function getSelectableOptionsOfInput(
        input: ElementFinder,
        rootElement?: ElementFinder
    ): Promise<string[]> {
        // close dropdown menu
        await selectableOptionsCloseMenu();
        // scroll to element
        browser.executeScript('arguments[0].scrollIntoView();', input.getWebElement());
        // click on element to open global dropdown menu
        await input.click();
        let options: string[];
        if (rootElement) {
            options = await getSelectableOptions(rootElement);
        } else {
            options = await getSelectableOptions();
        }
        // close dropdown menu
        await selectableOptionsCloseMenu();
        return options;
    }

    export async function getAllowStrings(rootElement?: ElementFinder) {
        const target = by.css('mesh-chip .chip-contents');
        let els: ElementArrayFinder;
        if (rootElement) {
            els = rootElement.all(target);
        } else {
            els = element.all(target);
        }
        return awaitArray(els.map(item => item!.getText()));
    }

    // async function inputSelectSetValue(inputSelect: ElementFinder, value: string) {
    //     await inputSelect.click();
    //     // check if options menu visible and target value contained
    //     const options = await SchemaEditorUtils.getSelectableOptions();
    //     if (options.filter(option => option === value).length !== 1) {
    //         throw new Error('No or more than one value selectable');
    //     }
    //     await element(by.cssContainingText('.select-option', value)).click();
    // }

    // async function inputSelectSetValues(inputSelect: ElementFinder, values: string[]) {
    //     await inputSelect.click();
    //     // check if options menu visible and target value cotnained
    //     const options = await SchemaEditorUtils.getSelectableOptions();
    //     if (options.filter(option => !!values.find(value => value === option)).length === 0) {
    //         throw new Error('Defined value does not exist for selection');
    //     }
    //     // click checkboxes
    //     values.forEach(async value => {
    //         const test = await element(by.cssContainingText('.select-option', value)).getText();
    //         console.log( '!!! TEST:', test );
    //         return await element(by.cssContainingText('.select-option', value)).element(by.css('[for*="checkbox"]')).click();
    //         // awaitArray(option.map(async (option: ElementFinder) => {
    //         //     const checkbox = await option.element(by.css('[type="checkbox"]'));
    //         //     await checkbox.click();
    //         // }));
    //     });
    // }

    /** Closes an open input select dropdown menu */
    async function selectableOptionsCloseMenu() {
        // check if any dropdown menu is open
        const dropdownIsOpen = await element(by.css('gtx-scroll-mask')).isPresent();
        if (!dropdownIsOpen) {
            return Promise.resolve();
        }
        // close dropdown menu
        return element(by.css('gtx-scroll-mask')).click();
    }
}
