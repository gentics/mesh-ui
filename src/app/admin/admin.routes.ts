import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project/project-detail/project-detail.component';

export const routes = [
    { path: '', component: DashboardComponent },
    { path: 'projects', component: ProjectListComponent },
    { path: 'projects/:uuid', component: ProjectDetailComponent }
];
