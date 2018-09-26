import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from 'gentics-ui-core';

import { TagsEffectsService } from '../core/providers/effects/tags-effects.service';
import { FormGeneratorModule } from '../form-generator/form-generator.module';
import { SharedModule } from '../shared/shared.module';

import { routes } from './admin.routes';
import { AdminBreadcrumbsComponent } from './components/admin-breadcrumbs/admin-breadcrumbs.component';
import { AdminListItemComponent } from './components/admin-list-item/admin-list-item.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { CreateProjectModalComponent } from './components/create-project-modal/create-project-modal.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { MicroschemaDetailComponent } from './components/microschema-detail/microschema-detail.component';
import { MicroschemaListComponent } from './components/microschema-list/microschema-list.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { NameInputDialogComponent } from './components/name-input-dialog/name-input-dialog.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectListItemComponent } from './components/project-list-item/project-list-item.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { SchemaAssignmentComponent } from './components/schema-assignment/schema-assignment.component';
import { SchemaDetailComponent } from './components/schema-detail/schema-detail.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserGroupSelectComponent } from './components/user-group-select/user-group-select.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminGroupEffectsService } from './providers/effects/admin-group-effects.service';
import { AdminProjectEffectsService } from './providers/effects/admin-project-effects.service';
import { AdminSchemaEffectsService } from './providers/effects/admin-schema-effects.service';
import { AdminUserEffectsService } from './providers/effects/admin-user-effects.service';
import { MicroschemaResolver } from './providers/resolvers/microschema-resolver';
import { ProjectResolver } from './providers/resolvers/project-resolver';
import { SchemaResolver } from './providers/resolvers/schema-resolver';
import { UserResolver } from './providers/resolvers/user-resolver';

@NgModule({
    declarations: [
        AdminBreadcrumbsComponent,
        AdminShellComponent,
        ProjectListComponent,
        ProjectListItemComponent,
        CreateProjectModalComponent,
        MicroschemaListComponent,
        MicroschemaDetailComponent,
        SchemaListComponent,
        SchemaDetailComponent,
        MonacoEditorComponent,
        SchemaAssignmentComponent,
        UserListComponent,
        AdminListComponent,
        AdminListItemComponent,
        UserDetailComponent,
        UserGroupSelectComponent,
        ProjectDetailComponent,
        NameInputDialogComponent,
        GroupListComponent,
        GroupDetailComponent
    ],
    entryComponents: [CreateProjectModalComponent, NameInputDialogComponent],
    imports: [SharedModule, RouterModule.forChild(routes), FormGeneratorModule],
    providers: [
        ModalService,
        AdminSchemaEffectsService,
        AdminProjectEffectsService,
        AdminUserEffectsService,
        AdminGroupEffectsService,
        TagsEffectsService,
        UserResolver,
        SchemaResolver,
        MicroschemaResolver,
        ProjectResolver
    ]
})
export class AdminModule {
    public static routes = routes;
}
