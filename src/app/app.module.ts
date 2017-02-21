import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules, Router } from '@angular/router';
import { GenticsUICoreModule } from 'gentics-ui-core';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

import { SharedModule } from './shared/shared.module';
import { I18nService } from './shared/providers/i18n/i18n.service';
import { StateModule } from './state/state.module';
import '../styles/main.scss';
import { AppState, InternalStateType } from './state/providers/app-state.service';
import { AuthGuard } from './auth-guard';
import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { EditorModule } from './editor/editor.module';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    AuthGuard
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

// TODO: re-enable lazy-loading of sub-modules once this issue is fixed:
// https://github.com/angular/angular/issues/12869#issuecomment-274202183
const appSubModules = [
    LoginModule,
    AdminModule,
    EditorModule
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        GenticsUICoreModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
        SharedModule,
        StateModule,
        ...appSubModules
    ],
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public i18nService: I18nService,
                private router: Router,
                public appState: AppState) {
        i18nService.setLanguage('en');
        // router.events.subscribe(event => console.log(event));
    }

    public hmrOnInit(store: StoreType) {
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState.restore(store.state);
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues  = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
