import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from 'gentics-ui-core';

import { routes } from './admin.routes';
import { SharedModule } from '../shared/shared.module';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectListItemComponent } from './components/project-list-item/project-list-item.component';
import { CreateProjectModalComponent } from './components/create-project-modal/create-project-modal.component';

@NgModule({
    declarations: [
        AdminShellComponent,
        ProjectListComponent,
        ProjectListItemComponent,
        CreateProjectModalComponent
    ],
    entryComponents: [
        CreateProjectModalComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        ModalService
    ]
})
export class AdminModule {
    public static routes = routes;
}
