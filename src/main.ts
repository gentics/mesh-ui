import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// TODO: switch to lettable operators (https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md)
// so as to not import the entire RXJS bundle thereby decreasing bundle size, allowing tree-shaking.
import 'rxjs/Rx';

import { AppModule } from './app/app.module';
import { environment, setupHotModuleReloading } from './environments/environment';
import { Router } from '@angular/router';
import { ApplicationStateService } from './app/state/providers/application-state.service';

if (environment.production) {
    enableProdMode();
}

declare var module: any;

if (module.hot) {
    setupHotModuleReloading(module.hot, AppModule, Router, ApplicationStateService)
        .catch(err => console.log(err));
} else {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.log(err));
}
