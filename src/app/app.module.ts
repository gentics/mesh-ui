import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules, Router } from '@angular/router';

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
import { AppState } from './state/models/app-state.model';
import { ApplicationStateService } from './state/providers/application-state.service';

import '../styles/main.scss';

import { AuthGuard } from './shared/providers/guards/auth-guard';
import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { EditorModule } from './editor/editor.module';
import { ChangePasswordModalComponent } from './shared/components/change-password-modal/change-password-modal.component';
import { CreateProjectModalComponent } from './admin/components/project/project-list/components/create-project-modal/create-project-modal.component';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    ApplicationStateService,
    AuthGuard
];

// Data type for saving and restoring application state with hot module reloading
interface HmrStore {
    state: AppState;
    restoreInputValues(): void;
    disposeOldHosts(): void;
};

// TODO: re-enable lazy-loading of sub-modules after upgrading to Angular 4:
// https://github.com/angular/angular/issues/12869#issuecomment-274202183
const appSubModules = [
    LoginModule,
    AdminModule,
    EditorModule
];

const ENTRY_COMPONENTS = [
    ChangePasswordModalComponent,
    CreateProjectModalComponent
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        ...ENTRY_COMPONENTS
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
        SharedModule,
        StateModule,
        ReactiveFormsModule,
        ...appSubModules
    ],
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS
    ],
    entryComponents: ENTRY_COMPONENTS
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public i18nService: I18nService,
                private router: Router,
                public appState: ApplicationStateService) {
        i18nService.setLanguage('en');
        // router.events.subscribe(event => console.log(event));
    }

    public hmrOnInit(store: HmrStore) {
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
