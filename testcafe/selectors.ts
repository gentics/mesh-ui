import { Selector } from 'testcafe';

export namespace selectors {
    export function gtxInputWithLabel(label: string) {
        return Selector('gtx-input')
            .find('label')
            .withText(label)
            .sibling('input');
    }

    export function labeledElement(tagName: string, label: string) {
        return Selector(tagName)
            .find('label')
            .withText(label)
            .parent(tagName);
    }
}
