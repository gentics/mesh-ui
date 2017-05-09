import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { Route } from '@angular/router';

export const routes: Route[] = [
    { path: '', component: AdminShellComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'projects' },
        { path: 'projects', component: ProjectListComponent }
    ] }
];
