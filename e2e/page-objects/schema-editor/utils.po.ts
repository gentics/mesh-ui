import { browser, by, element, ElementArrayFinder, ElementFinder, Key } from 'protractor';

import { isValidString } from '../../../src/app/common/util/util';
import { awaitArray } from '../../testUtil';

export namespace SchemaEditorUtils {
    // GETTERS /////////////////////////////////////////////////////////////////////////////////////

    export function getInputTextElementByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"] input`);
        if (rootElement) {
            return rootElement.element(target);
        } else {
            return element(target);
        }
    }

    export function getInputCheckboxElementByFormControlName(formControlName: string, rootElement?: ElementFinder) {
        const target = by.css(`[formControlName="${formControlName}"]`);
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
        } else {
            return false;
        }
    }

    export async function getInputSelectSingleValueByFormControlName(
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
        // return el.getText();
        const value = await el.getText();
        if (isValidString(value)) {
            return value;
        }
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
        const valuesRaw = await el.getText();
        // if its just empty string or blank spaces, stop
        if (!isValidString(valuesRaw)) {
            return;
        }

        valuesRaw.replace(/\s/g, '');
        return valuesRaw.split(new RegExp(/,/)).map(item => item.replace(/\s/g, ''));
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
    function getSelectableOptions(): Promise<string[]> {
        const els = element.all(by.css('gtx-dropdown-content .select-option'));
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
            options = await getSelectableOptions();
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

    // SETTERS /////////////////////////////////////////////////////////////////////////////////////

    export async function inputTextSetValue(value: string, formControlname: string, rootElement?: ElementFinder) {
        if (!isValidString(value)) {
            throw new Error('Value is not valid string');
        }
        const input = await getInputTextElementByFormControlName(formControlname, rootElement && rootElement);
        // clear existing text
        await input.clear();
        return await input.sendKeys(value);
    }

    export async function inputCheckboxSetValue(value: boolean, formControlname: string, rootElement?: ElementFinder) {
        const input = await getInputCheckboxElementByFormControlName(formControlname, rootElement && rootElement);
        const inputValue = await getInputCheckboxValueByFormControlName(formControlname, rootElement && rootElement);
        if (inputValue === false && value === true) {
            return await input.click();
        } else if (inputValue === true && value === true) {
            return Promise.resolve();
        } else if (inputValue === false && value === false) {
            return Promise.resolve();
        } else if (inputValue === true && value === false) {
            return await input.click();
        }
    }

    export async function inputSelectSetValueSingle(
        value: string,
        formControlname: string,
        rootElement?: ElementFinder
    ) {
        const input = getInputSelectElementByFormControlName(formControlname, rootElement && rootElement);
        // check if options menu visible and target value contained
        await input.click();
        browser.waitForAngular();
        const options = await getSelectableOptions();
        if (!options || options.filter(option => option === value).length !== 1) {
            throw new Error('No or more than one value selectable');
        }
        return await element(by.cssContainingText('.select-option', value)).click();
    }

    export async function inputChipsSetValue(values: string[], formControlname: string, rootElement?: ElementFinder) {
        if (!values || !values.length || values.length < 1) {
            throw new Error('Invalid value parameter');
        }
        const input = await getInputTextElementByFormControlName(formControlname, rootElement && rootElement);
        // clear existing text
        await input.clear();

        return values.reduce(async (promiseChain, value) => {
            return promiseChain.then(
                () =>
                    new Promise(async resolve => {
                        await input.sendKeys(value);
                        await input.sendKeys(Key.ENTER);
                        resolve();
                    })
            );
        }, Promise.resolve({}));
    }

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
