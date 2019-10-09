import { Selector } from 'testcafe';

import { Breadcrumbs } from '../../common/breadcrumbs';

import { NodeBrowserRow } from './node-browser-row';

export namespace nodeBrowser {
    export const chooseButton = Selector('mesh-node-browser button').withText('CHOOSE');
    export const breadcrumbs = new Breadcrumbs(Selector('mesh-node-browser gtx-breadcrumbs'));

    export function getNodeRow(displayName: string) {
        return new NodeBrowserRow(
            Selector('gtx-contents-list-item .displayName')
                .withText(displayName)
                .parent('gtx-contents-list-item')
        );
    }
}
