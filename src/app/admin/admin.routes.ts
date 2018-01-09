import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MicroschemaComponent } from './components/microschema/mircoschema.component';
import { AppState } from '../state/models/app-state.model';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { SchemaComponent } from './components/schema/schema.component';
import { EntitiesService } from '../state/providers/entities.service';
import { Microschema } from '../common/models/microschema.model';
import { Schema } from '../common/models/schema.model';
import { BreadcrumbTextFunction } from './components/admin-breadcrumbs/admin-breadcrumbs.component';

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


export function entityName(newName: string): BreadcrumbTextFunction {
    return (route: ActivatedRouteSnapshot, state: AppState, entities: EntitiesService): string => {
        const entity = state.admin.openEntity;
        let result;
        if (entity && !entity.isNew && entity.uuid) {
            let schemaOrMicroschema: Schema | Microschema | undefined;
            if (entity.type === 'schema') {
                schemaOrMicroschema = entities.getSchema(entity.uuid);
            } else if (entity.type === 'microschema') {
                schemaOrMicroschema = entities.getMicroschema(entity.uuid);
            }
            result =  schemaOrMicroschema && schemaOrMicroschema.name;
        } else if (entity && entity.isNew) {
            // TODO i18n or rework this
            result = newName;
        } else {
            result = '';
        }
        return result;
    };
}
