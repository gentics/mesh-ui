import { Selector } from 'testcafe';

export function baseUrl() {
    return process.env.MESHUI_URL || 'http://localhost:4200';
}

export function formControlInput(name: string) {
    return Selector('gtx-input')
        .withAttribute('formcontrolname', name)
        .find('input');
}

export function formControlCheckbox(name: string) {
    return Selector('gtx-checkbox')
        .withAttribute('formcontrolname', name)
        .find('label');
}
