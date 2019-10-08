import { t, Selector } from 'testcafe';

import { selectors } from '../../../selectors';
import { formControlCheckbox, formControlInput } from '../../../testUtil';

export interface ProjectCreateFormData {
    name: string;
    // TODO schema
    // schema?: string;
    anonymousAccess?: boolean;
}

export namespace projectList {
    export async function createProject(formData: ProjectCreateFormData) {
        await clickProjectCreateButton();
        await t.typeText(formControlInput('name'), formData.name);

        // Default is checked, so we uncheck only when it is explicitly set to false
        if (formData.anonymousAccess === false) {
            await t.click(formControlCheckbox('anonymousAccess'));
        }

        await t.click(Selector('mesh-create-project-modal button').withText('CREATE PROJECT'));
    }

    export async function enterSearchTerm(term: string) {
        await t.typeText(selectors.gtxInputWithLabel('name'), term);
    }

    export async function clickProjectCreateButton() {
        await t.click(Selector('button').withText('CREATE PROJECT'));
    }
}
