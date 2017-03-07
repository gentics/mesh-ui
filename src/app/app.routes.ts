import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { NoContentComponent } from './shared/components/no-content/no-content.component';
import { LoginModule } from './login/login.module';
import { EditorModule } from './editor/editor.module';
import { AdminModule } from './admin/admin.module';

// TODO: re-enable lazy-loading of sub-modules once this issue is fixed:
// https://github.com/angular/angular/issues/12869#issuecomment-274202183
// (probably with Angular 4.0.0 final)
export const ROUTES: Routes = [
    // { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'login', children: LoginModule.routes },
    /*{ path: '**',    component: NoContentComponent },*/
    { path: '', canActivate: [AuthGuard], children: [
        // { path: '', loadChildren: './editor/editor.module#EditorModule' },
        { path: '', children: EditorModule.routes },
        // { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
        { path: 'admin', children: AdminModule.routes }
    ] },
];
