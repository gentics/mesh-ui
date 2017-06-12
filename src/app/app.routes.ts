import { Routes } from '@angular/router';
import { AuthGuard } from './core/providers/guards/auth-guard';

export const ROUTES: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '',  children: [
        { path: 'editor', canActivate: [AuthGuard], loadChildren: './editor/editor.module#EditorModule' },
        { path: 'admin', canActivate: [AuthGuard], loadChildren: './admin/admin.module#AdminModule' }
    ] },
];
