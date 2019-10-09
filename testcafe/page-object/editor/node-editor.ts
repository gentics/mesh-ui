import { t, ClientFunction, Selector } from 'testcafe';

import { selectors } from '../../selectors';
import { toast } from '../toast';

import { NodeField } from './fields/node-field';
import { NumberField } from './fields/number-field';
import { OptionStringField } from './fields/option-string-field';
import { StringField } from './fields/string-field';

const getWindowLocation = ClientFunction(() => window.location.href);

export type LanguageVersion = 'English' | 'German';

export namespace nodeEditor {
    export async function save(expectSuccess = true) {
        await t.click(Selector('button').withText('SAVE'));
        if (expectSuccess) {
            await toast.expectSuccessMessage('Node successfully saved');
        }
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
        return new NumberField(selectors.labeledElement('mesh-number-field', fieldName));
    }

    export function getStringField(fieldName: string) {
        return new StringField(selectors.labeledElement('mesh-string-field', fieldName));
    }

    export function getOptionStringField(fieldName: string) {
        return new OptionStringField(selectors.labeledElement('mesh-string-field', fieldName));
    }

    export function getNodeField(fieldName: string) {
        return new NodeField(selectors.labeledElement('mesh-node-field', fieldName));
    }
}
