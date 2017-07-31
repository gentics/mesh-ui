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
import { ProjectEffectsService } from './providers/effects/project-effects.service';
import { MicroschemaListComponent } from './components/microschema-list/mircoschema-list.component';
import { MicroschemaEffectsService } from './providers/effects/microschema-effects.service';
import { MicroschemaComponent } from './components/microschema/mircoschema.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { SchemaComponent } from './components/schema/schema.component';

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
        ProjectEffectsService,
        MicroschemaEffectsService
    ]
})
export class AdminModule {
    public static routes = routes;
}
