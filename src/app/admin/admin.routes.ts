import { Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MicroschemaComponent } from './components/microschema/mircoschema.component';
import { AppState } from '../state/models/app-state.model';

export const routes: Route[] = [
    { path: '', component: AdminShellComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'projects' },
        { path: 'projects', component: ProjectListComponent, data: { breadcrumb: 'Projects' } },
        { path: 'microschemas', data: { breadcrumb: 'Microschemas' }, children: [
            { path: '', component: MicroschemaListComponent },
            { path: ':uuid', component: MicroschemaComponent, data: { breadcrumb: microSchemaName }}
        ]},
    ] }
];

function microSchemaName(state: AppState): string {
    const entity = state.admin.openEntity;
    let result;
    if (entity) {
        result =  state.entities.microschema[entity.uuid].name;
    } else {
        result = 'New Microschema';
    }
    return result;
}
