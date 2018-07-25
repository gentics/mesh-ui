import { browser, by } from 'protractor';

export function browse() {
    return popover()
        .element(by.css('.ql-mesh-browse'))
        .click();
}

export function save() {
    return popover()
        .element(by.css('.ql-action'))
        .click();
}

export function remove() {
    return popover()
        .element(by.css('.ql-remove'))
        .click();
}

function popover() {
    return browser.element(by.css('.ql-tooltip:not(.ql-hidden)'));
}
