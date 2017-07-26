import { Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MicroschemaComponent } from './components/microschema/mircoschema.component';

export const routes: Route[] = [
    { path: '', component: AdminShellComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'projects' },
        { path: 'projects', component: ProjectListComponent, data: { breadcrumb: 'Projects' } },
        { path: 'microschemas', component: MicroschemaListComponent, data: { breadcrumb: 'Microschemas' } },
        { path: 'microschemas/:uuid', component: MicroschemaComponent, data: { breadcrumb: '???'}}
    ] }
];
