import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from 'gentics-ui-core';

import { routes } from './admin.routes';
import { SharedModule } from '../shared/shared.module';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectListItemComponent } from './components/project-list-item/project-list-item.component';
import { CreateProjectModalComponent } from './components/create-project-modal/create-project-modal.component';
import { AdminBreadcrumbsComponent } from './components/admin-breadcrumbs/admin-breadcrumbs.component';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { SchemaAssignmentComponent } from './components/schema-assignment/schema-assignment.component';
import { AdminSchemaEffectsService } from './providers/effects/admin-schema-effects.service';
import { AdminProjectEffectsService } from './providers/effects/admin-project-effects.service';
import { AdminUserEffectsService } from './providers/effects/admin-user-effects.service';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { AdminListItemComponent } from './components/admin-list-item/admin-list-item.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserResolver } from './providers/resolvers/user-resolver';
import { SchemaResolver } from './providers/resolvers/schema-resolver';
import { MicroschemaResolver } from './providers/resolvers/microschema-resolver';
import { MicroschemaDetailComponent } from './components/microschema-detail/mircoschema-detail.component';
import { SchemaDetailComponent } from './components/schema-detail/schema-detail.component';
import { UserGroupSelectComponent } from './components/user-group-select/user-group-select.component';
import { FormGeneratorModule } from '../form-generator/form-generator.module';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectResolver } from './providers/resolvers/project-resolver';
import { TagsEffectsService } from '../core/providers/effects/tags-effects.service';
import { CreateTagDialogComponent } from '../shared/components/create-tag-dialog/create-tag-dialog.component';
import { NameInputDialogComponent } from './components/name-input-dialog/name-input-dialog.component';

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
        NameInputDialogComponent
    ],
    entryComponents: [
        CreateProjectModalComponent,
        NameInputDialogComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormGeneratorModule
    ],
    providers: [
        ModalService,
        AdminSchemaEffectsService,
        AdminProjectEffectsService,
        AdminUserEffectsService,
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
