import { Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MicroschemaComponent } from './components/microschema/mircoschema.component';
import { AppState } from '../state/models/app-state.model';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { SchemaComponent } from './components/schema/schema.component';

export const routes: Route[] = [
    { path: '', component: AdminShellComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'projects' },
        { path: 'projects', component: ProjectListComponent, data: { breadcrumb: 'Projects' } },
        { path: 'microschemas', data: { breadcrumb: 'Microschemas' }, children: [
            { path: '', component: MicroschemaListComponent },
            { path: ':uuid', component: MicroschemaComponent, data: { breadcrumb: entityName('New Microschema') }}
        ]},
        { path: 'schemas', data: { breadcrumb: 'Schemas' }, children: [
            { path: '', component: SchemaListComponent },
            { path: ':uuid', component: SchemaComponent, data: { breadcrumb: entityName('New Schema') }}
        ]},
    ] }
];


function entityName(fallBackName: string) {
    return (route: any, state: AppState): string => {
        const entity = state.admin.openEntity;
        let result;
        if (entity) {
            result =  state.entities[entity.type][entity.uuid].name;
        } else {
            // TODO i18n or rework this
            result = fallBackName;
        }
        return result;
    };
}
