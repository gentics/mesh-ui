import { t, Selector } from 'testcafe';

export type ProjectDetailTab = 'PROJECT' | 'SCHEMAS' | 'MICROSCHEMAS';

export namespace projectDetail {
    export async function openTab(tab: ProjectDetailTab) {
        await t.click(Selector("gtx-tabs a[role='tab']").withText(tab));
    }
}
