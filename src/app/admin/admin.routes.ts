import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MicroschemaComponent } from './components/microschema/mircoschema.component';
import { AppState } from '../state/models/app-state.model';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { SchemaComponent } from './components/schema/schema.component';
import { EntitiesService } from '../state/providers/entities.service';
import { BreadcrumbTextFunction } from './components/admin-breadcrumbs/admin-breadcrumbs.component';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Route[] = [
    { path: '', component: AdminShellComponent, children: [
            { path: '', pathMatch: 'full', redirectTo: 'projects' },
            { path: 'projects', component: ProjectListComponent, data: { breadcrumb: 'Projects' } },
            {
                path: 'microschemas',
                data: { breadcrumb: 'Microschemas' },
                children: [
                    { path: '', component: MicroschemaListComponent },
                    { path: ':uuid', component: MicroschemaComponent, data: { breadcrumb: microschemaName('New Microschema') }}
                ]
            },
            {
                path: 'schemas',
                data: { breadcrumb: 'Schemas' },
                children: [
                    { path: '', component: SchemaListComponent },
                    { path: ':uuid', component: SchemaComponent, data: { breadcrumb: schemaName('New Schema') }}
                ]
            },
            {
                path: 'users',
                data: { breadcrumb: 'Users' },
                children: [
                    { path: '', component: UserListComponent },
                    // { path: ':uuid', component: SchemaComponent, data: { breadcrumb: schemaName('New Schema') }}
                ]
            },
        ] }
];

// TODO: needs improvement:
// - support i18n for newName
// - Possibly return an Observable to prevent race conditions as the entity is loaded (currently always flashes newName before
//   resolving to the correct entity name.
export function schemaName(newName: string): BreadcrumbTextFunction {
    return (route: ActivatedRouteSnapshot, state: AppState, entities: EntitiesService): string => {
        const schemaUuid = state.adminSchemas.schemaDetail;
        const isNew = !schemaUuid;
        if (isNew) {
            return newName;
        } else {
            const schema = entities.getSchema(schemaUuid);
            return schema && schema.name;
        }
    };
}

export function microschemaName(newName: string): BreadcrumbTextFunction {
    return (route: ActivatedRouteSnapshot, state: AppState, entities: EntitiesService): string => {
        const microschemaUuid = state.adminSchemas.microschemaDetail;
        const isNew = !microschemaUuid;
        if (isNew) {
            return newName;
        } else {
            const microschema = entities.getMicroschema(microschemaUuid);
            return microschema && microschema.name;
        }
    };
}
