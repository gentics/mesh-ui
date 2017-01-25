import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { NoContentComponent } from './shared/components/no-content/no-content.component';

export const ROUTES: Routes = [
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    /*{ path: '**',    component: NoContentComponent },*/
    { path: '', canActivate: [AuthGuard], children: [
        { path: '', loadChildren: './editor/editor.module#EditorModule' },
        { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
    ] },
];
