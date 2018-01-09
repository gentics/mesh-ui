import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode } from '@angular/core';

import { API_BASE_URL } from '../app/core/providers/api/api-di-tokens';


// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = <T>(value: T): T => value;

_decorateModuleRef = (modRef: any) => {
  disableDebugTools();

  return modRef;
};

PROVIDERS = [
  ...PROVIDERS,
  // custom providers in production
];


export const decorateModuleRef = _decorateModuleRef;

export const environment = {
  production: true
};
