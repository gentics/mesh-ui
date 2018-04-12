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
import { MicroschemaComponent } from './components/microschema/mircoschema.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { SchemaComponent } from './components/schema/schema.component';
import { SchemaAssignmentComponent } from './components/schema-assignment/schema-assignment.component';
import { AdminSchemaEffectsService } from './providers/effects/admin-schema-effects.service';
import { AdminProjectEffectsService } from './providers/effects/admin-project-effects.service';

@NgModule({
    declarations: [
        AdminBreadcrumbsComponent,
        AdminShellComponent,
        ProjectListComponent,
        ProjectListItemComponent,
        CreateProjectModalComponent,
        MicroschemaListComponent,
        MicroschemaComponent,
        SchemaListComponent,
        SchemaComponent,
        MonacoEditorComponent,
        SchemaAssignmentComponent
    ],
    entryComponents: [
        CreateProjectModalComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        ModalService,
        AdminSchemaEffectsService,
        AdminProjectEffectsService
    ]
})
export class AdminModule {
    public static routes = routes;
}
