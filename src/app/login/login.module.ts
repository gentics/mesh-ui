import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './login.routes';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthEffectsService } from './providers/auth-effects.service';

@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        AuthEffectsService
    ]
})
export class LoginModule {
    public static routes = routes;
}
