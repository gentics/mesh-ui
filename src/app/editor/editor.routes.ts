import { Route } from '@angular/router';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { ContainerContentsComponent } from './components/container-contents/container-contents.component';

export const routes: Route[] = [
    /**
     * TODO: this top-level path "project" is not really needed, but at the moment there is a bug with the router
     * (https://github.com/angular/angular/issues/10726) which means that if an empty top-level route is used,
     * aux routes do not get correctly matched.
     */
    { path: 'project', component: MasterDetailComponent, children: [
        {
            path: ':projectName/:containerUuid',
            component: ContainerContentsComponent,
            outlet: 'list'
        },
        {
            path: ':projectName/:nodeUuid',
            component: NodeEditorComponent,
            outlet: 'detail'
        }
    ]},
];
