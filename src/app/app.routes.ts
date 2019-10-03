import { Routes } from '@angular/router';

import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { AuthGuard } from './core/providers/guards/auth-guard';

export const ROUTER_CONFIG: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'not-found', component: NotFoundComponent },
    {
        path: '',
        children: [
            {
                path: 'editor',
                canActivate: [AuthGuard],
                loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
            },
            {
                path: 'admin',
                canActivate: [AuthGuard],
                loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
            }
        ]
    },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];
