import { Route } from '@angular/router';

import { ContainerContentsComponent } from './components/container-contents/container-contents.component';
import { ContainerEmptyComponent } from './components/container-empty/container-empty.component';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { NoProjectsGuard } from './providers/no-projects.guard';
import { NodeEditorGuard } from './providers/node-editor-guard';

export const routes: Route[] = [
    /**
     * TODO: this top-level path "project" is not really needed, but at the moment there is a bug with the router
     * (https://github.com/angular/angular/issues/10726) which means that if an empty top-level route is used,
     * aux routes do not get correctly matched.
     */
    {
        path: 'project',
        component: MasterDetailComponent,
        canActivateChild: [NoProjectsGuard],
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
