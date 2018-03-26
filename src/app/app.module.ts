import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { PreloadAllModules, Router, RouterModule } from '@angular/router';
/*
 * Platform and Environment providers/directives/pipes
 */

//import { ROUTER_CONFIG } from './app.routes';

import { Routes } from '@angular/router';
import { AuthGuard } from './core/providers/guards/auth-guard';

// App is our top level component
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { I18nService } from './core/providers/i18n/i18n.service';
import { StateModule } from './state/state.module';
import { CoreModule } from './core/core.module';
import { AppState } from './state/models/app-state.model';
import { ApplicationStateService } from './state/providers/application-state.service';

import '../styles/main.scss';
import { AuthEffectsService } from './login/providers/auth-effects.service';

export const ROUTER_CONFIG: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '',  children: [
        { path: 'editor', canActivate: [AuthGuard], loadChildren: './editor/editor.module#EditorModule' },
        { path: 'admin', canActivate: [AuthGuard], loadChildren: './admin/admin.module#AdminModule' }
    ] },
];


// Data type for saving and restoring application state with hot module reloading
interface HmrStore {
    state: AppState;
    restoreInputValues(): void;
    disposeOldHosts(): void;
}

/**
 * `AppModule` is the main entry point into Angular's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        RouterModule.forRoot(ROUTER_CONFIG, { useHash: true, preloadingStrategy: PreloadAllModules }),
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        CoreModule,
        SharedModule,
        StateModule
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public i18nService: I18nService,
                private router: Router,
                private authEffects: AuthEffectsService,
                public appState: ApplicationStateService) {
        i18nService.setLanguage('en');
        authEffects.validateSession();
        // router.events.subscribe(event => console.log(event));
    }

    public hmrOnInit(store: HmrStore) {
        if (!store || !store.state) {
            return;
        }
        // console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState.restore(store.state);
        // set input values
        if ('restoreInputValues' in store) {
            const restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: HmrStore) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        store.state = this.appState.now;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues  = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: HmrStore) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
