import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// TODO: switch to lettable operators (https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md)
// so as to not import the entire RXJS bundle thereby decreasing bundle size, allowing tree-shaking.
import 'rxjs/Rx';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
