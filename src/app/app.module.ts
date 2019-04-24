import { HttpClientModule } from '@angular/common/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, Router, RouterModule } from '@angular/router';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import '../styles/main.scss';

import { AppComponent } from './app.component';
import { ROUTER_CONFIG } from './app.routes';
import { CoreModule } from './core/core.module';
import { I18nService } from './core/providers/i18n/i18n.service';
import { SearchEffectsService } from './core/providers/search/search-effects.service';
import { AuthEffectsService } from './login/providers/auth-effects.service';
import { SharedModule } from './shared/shared.module';
import { AppState } from './state/models/app-state.model';
import { ApplicationStateService } from './state/providers/application-state.service';
import { StateModule } from './state/state.module';

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
        HttpClientModule,
        CoreModule,
        SharedModule,
        StateModule
    ]
})
export class AppModule {
    constructor(
        public appRef: ApplicationRef,
        public i18nService: I18nService,
        public appState: ApplicationStateService,
        authEffects: AuthEffectsService,
        searchEffects: SearchEffectsService
    ) {
        i18nService.setLanguage('en');
        authEffects.validateSession();
        searchEffects.checkSearchAvailability();
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
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // save state
        store.state = this.appState.now;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: HmrStore) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
