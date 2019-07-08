import { Route } from '@angular/router';

import { AssureEntitiesGuard } from '../core/providers/guards/assure-entities.guard';

import { ContainerContentsComponent } from './components/container-contents/container-contents.component';
import { ContainerEmptyComponent } from './components/container-empty/container-empty.component';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { NodeEditorGuard } from './providers/node-editor-guard';

export const routes: Route[] = [
    {
        path: 'project',
        component: MasterDetailComponent,
        canActivate: [AssureEntitiesGuard],
        canActivateChild: [AssureEntitiesGuard],
        children: [
            {
                path: ':projectName/:containerUuid/:language',
                component: ContainerContentsComponent,
                outlet: 'list'
            },
            {
                path: ':projectName/:command/:schemaUuid/:parentNodeUuid/:language',
                component: NodeEditorComponent,
                outlet: 'detail',
                canDeactivate: [NodeEditorGuard]
            },
            {
                path: ':projectName/:nodeUuid/:language',
                component: NodeEditorComponent,
                outlet: 'detail',
                canDeactivate: [NodeEditorGuard]
            }
        ]
    },
    {
        path: 'empty',
        component: ContainerEmptyComponent
    }
];
