import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { ContainerContentsComponent } from './components/container-contents/container-contents.component';

export const routes = [
    { path: '', component: MasterDetailComponent, children: [
        {
            path: '',
            component: ContainerContentsComponent,
            outlet: 'list'
        },
        {
            path: '',
            component: NodeEditorComponent,
            outlet: 'detail'
        }
    ]},
];
