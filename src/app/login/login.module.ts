import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './login.routes';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [
        SharedModule,
        // RouterModule.forChild(routes),
    ],
})
export class LoginModule {
    public static routes = routes;
}
