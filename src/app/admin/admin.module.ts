import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './admin.routes';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project/project-detail/project-detail.component';
import { ProjectListItemComponent } from './components/project/project-list/components/project-list-item/project-list-item.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ProjectListComponent,
        ProjectListItemComponent,
        ProjectDetailComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
})
export class AdminModule {
    public static routes = routes;
}
