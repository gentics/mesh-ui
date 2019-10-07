import { Selector } from 'testcafe';

export namespace selectors {
    export function gtxInputWithLabel(label: string) {
        return Selector('gtx-input')
            .find('label')
            .withText(label)
            .sibling('input');
    }
}
