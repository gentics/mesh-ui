import { Selector } from 'testcafe';

import { range } from './testUtil';

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

    export async function all(selector: Selector) {
        const count = await selector.count;
        return range(count).map(i => selector.nth(i));
    }
}
