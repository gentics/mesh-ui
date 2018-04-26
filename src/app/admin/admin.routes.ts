import { Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { MicroschemaDetailComponent } from './components/microschema-detail/mircoschema-detail.component';
import { SchemaDetailComponent } from './components/schema-detail/schema-detail.component';
import { userBreadcrumbFn, UserResolver } from './providers/resolvers/user-resolver';
import { schemaBreadcrumbFn, SchemaResolver } from './providers/resolvers/schema-resolver';
import { microschemaBreadcrumbFn, MicroschemaResolver } from './providers/resolvers/microschema-resolver';

export const routes: Route[] = [
    { path: '', component: AdminShellComponent, children: [
            { path: '', pathMatch: 'full', redirectTo: 'projects' },
            { path: 'projects', component: ProjectListComponent, data: { breadcrumb: 'Projects' } },
            {
                path: 'microschemas',
                data: { breadcrumb: 'Microschemas' },
                children: [
                    { path: '', component: MicroschemaListComponent },
                    {
                        path: ':uuid',
                        component: MicroschemaDetailComponent,
                        resolve: { microschema: MicroschemaResolver },
                        data: { breadcrumb: microschemaBreadcrumbFn }
                    }
                ]
            },
            {
                path: 'schemas',
                data: { breadcrumb: 'Schemas' },
                children: [
                    { path: '', component: SchemaListComponent },
                    {
                        path: ':uuid',
                        component: SchemaDetailComponent,
                        resolve: {schema: SchemaResolver },
                        data: { breadcrumb: schemaBreadcrumbFn }
                    }
                ]
            },
            {
                path: 'users',
                data: { breadcrumb: 'Users' },
                children: [
                    { path: '', component: UserListComponent },
                    {
                        path: ':uuid',
                        component: UserDetailComponent,
                        resolve: { user: UserResolver },
                        data: { breadcrumb: userBreadcrumbFn }
                    }
                ]
            },
        ] }
];
