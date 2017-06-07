import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { PreloadAllModules, Router, RouterModule } from '@angular/router';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';
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
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
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
