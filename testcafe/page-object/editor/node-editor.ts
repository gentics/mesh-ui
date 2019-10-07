import { t, ClientFunction, Selector } from 'testcafe';

import { NumberField } from './fields/number-field';

const getWindowLocation = ClientFunction(() => window.location.href);

export type LanguageVersion = 'English' | 'German';

export namespace nodeEditor {
    export async function save() {
        await t.click(Selector('button').withText('SAVE'));
    }

    export async function getCurrentNodeUuid(): Promise<string> {
        const url = await getWindowLocation();
        const match = url.match(/detail:demo\/([^\/]*)\//);
        if (!match) {
            throw new Error(`Could not get uuid from url. Url is ${url}`);
        }
        return match[1];
    }

    export async function showPath() {
        await t.click('mesh-node-path icon.copy');
    }

    export async function getNodePath(): Promise<string | undefined> {
        return Selector('mesh-node-path input').value;
    }

    export async function createLanguageVersion(language: LanguageVersion) {
        await t.click('mesh-node-language-switcher');
        await t.click(Selector('gtx-dropdown-item').withText(`Create ${language} version`));
    }

    export function getNumberField(fieldName: string) {
        return new NumberField(
            Selector('mesh-number-field')
                .find('label')
                .withText(fieldName)
                .parent('mesh-number-field')
        );
    }
}
