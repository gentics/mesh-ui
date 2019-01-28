import { Route } from '@angular/router';

import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { MicroschemaDetailComponent } from './components/microschema-detail/microschema-detail.component';
import { MicroschemaListComponent } from './components/microschema-list/microschema-list.component';
import { ProjectDetailSchemasComponent } from './components/project-detail-schemas/project-detail-schemas.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { SchemaDetailComponent } from './components/schema-detail/schema-detail.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SchemaDetailsGuard } from './providers/guards/schema-editor-guard';
import { groupBreadcrumbFn, GroupResolver } from './providers/resolvers/group-resolver';
import { microschemaBreadcrumbFn, MicroschemaResolver } from './providers/resolvers/microschema-resolver';
import { projectBreadcrumbFn, ProjectResolver } from './providers/resolvers/project-resolver';
import { roleBreadcrumbFn, RoleResolver } from './providers/resolvers/role-resolver';
import { schemaBreadcrumbFn, SchemaResolver } from './providers/resolvers/schema-resolver';
import { userBreadcrumbFn, UserResolver } from './providers/resolvers/user-resolver';

export const routes: Route[] = [
    {
        path: '',
        component: AdminShellComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'projects' },
            {
                path: 'projects',
                data: { breadcrumb: 'common.projects' },
                children: [
                    { path: '', component: ProjectListComponent },
                    {
                        path: ':uuid',
                        component: ProjectDetailComponent,
                        resolve: { project: ProjectResolver },
                        data: { breadcrumb: projectBreadcrumbFn }
                    }
                ]
            },
            {
                path: 'microschemas',
                data: { breadcrumb: 'common.microschemas' },
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
                data: { breadcrumb: 'common.schemas' },
                children: [
                    { path: '', component: SchemaListComponent },
                    {
                        path: ':uuid',
                        component: SchemaDetailComponent,
                        resolve: { schema: SchemaResolver },
                        data: { breadcrumb: schemaBreadcrumbFn },
                        canDeactivate: [SchemaDetailsGuard]
                    }
                ]
            },
            {
                path: 'users',
                data: { breadcrumb: 'common.users' },
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
            {
                path: 'groups',
                data: { breadcrumb: 'common.groups' },
                children: [
                    { path: '', component: GroupListComponent },
                    {
                        path: ':uuid',
                        component: GroupDetailComponent,
                        resolve: { group: GroupResolver },
                        data: { breadcrumb: groupBreadcrumbFn }
                    }
                ]
            },
            {
                path: 'roles',
                data: { breadcrumb: 'common.roles' },
                children: [
                    { path: '', component: RoleListComponent },
                    {
                        path: ':uuid',
                        component: RoleDetailComponent,
                        resolve: { role: RoleResolver },
                        data: { breadcrumb: roleBreadcrumbFn }
                    }
                ]
            }
        ]
    }
];
