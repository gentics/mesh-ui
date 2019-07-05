import { Routes } from '@angular/router';

import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { AuthGuard } from './core/providers/guards/auth-guard';

export const ROUTER_CONFIG: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'not-found', component: NotFoundComponent },
    {
        path: '',
        children: [
            { path: 'editor', canActivate: [AuthGuard], loadChildren: './editor/editor.module#EditorModule' },
            { path: 'admin', canActivate: [AuthGuard], loadChildren: './admin/admin.module#AdminModule' }
        ]
    },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];
