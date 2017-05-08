import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectListComponent } from './components/project-list/project-list.component';

export const routes = [
    { path: '', component: DashboardComponent },
    { path: 'projects', component: ProjectListComponent }
];
