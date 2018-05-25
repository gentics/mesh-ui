// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { enableProdMode, ApplicationRef } from '@angular/core';
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';

import { API_BASE_URL } from '../app/core/providers/api/api-di-tokens';

// Environment Providers
let PROVIDERS: any[] = [
    // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = <T>(value: T): T => value;

_decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const _ng = (window as any).ng;
    enableDebugTools(cmpRef);
    (window as any).ng.probe = _ng.probe;
    (window as any).ng.coreTokens = _ng.coreTokens;
    return modRef;
};

// Development
PROVIDERS = [
    ...PROVIDERS,
    // custom providers in development
    { provide: API_BASE_URL, useValue: '/api/v1' }
];

export const decorateModuleRef = _decorateModuleRef;

export const environment = {
    production: false
};
