import { Routes } from '@angular/router';
import { AuthGuard } from './shared/providers/guards/auth-guard';
import { EditorModule } from './editor/editor.module';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';

// TODO Use lazy loading. At the moment this causes problem with the gtx-overlay-host,
// because the service is instantiated twice when we use lazy loading.
export const ROUTES: Routes = [
    { path: 'login', children: LoginModule.routes },
    { path: '',  children: [
        { path: 'editor', canActivate: [AuthGuard], children: EditorModule.routes },
        { path: 'admin', canActivate: [AuthGuard], children: AdminModule.routes }
    ] },
];
