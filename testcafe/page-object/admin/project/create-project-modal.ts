import { t, Selector } from 'testcafe';

import { formControlInput } from '../../../testUtil';

export namespace createProjectModal {
    export async function getName(): Promise<string> {
        const name = await formControlInput('name').value;
        return name || '';
    }
}
