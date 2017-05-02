import { Routes } from '@angular/router';
import { AuthGuard } from './shared/providers/guards/auth-guard';

export const ROUTES: Routes = [
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    // TODO: Change this to actual new route
    { path: 'changepassword', loadChildren: './login/login.module#LoginModule' },
    { path: '',  children: [
        { path: 'editor', canActivate: [AuthGuard], loadChildren: './editor/editor.module#EditorModule' },
        { path: 'admin', canActivate: [AuthGuard], loadChildren: './admin/admin.module#AdminModule' }
    ] },
];
