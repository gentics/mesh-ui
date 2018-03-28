// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';

import { ApplicationStateService } from '../app/state/providers/application-state.service';
import { API_BASE_URL } from '../app/core/providers/api/api-di-tokens';
import { AppState } from '../app/state/models/app-state.model';




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

export function setupHotModuleReloading(hotModule: any, appModule: any, routerToken: any, stateServiceToken: any) {
    let router: Router;
    let stateService: ApplicationStateService;
    let previousState: AppState;
    let previousUrl: string;

    if (hotModule) {
        hotModule.accept();

        previousState = hotModule.data && hotModule.data.state;
        previousUrl = hotModule.data && hotModule.data.url || '';

        hotModule.dispose((data: any) => {
            const stateToSave = stateService && stateService.now;
            data.state = stateToSave;
            data.url = router.url;
        });

        const appRootTagName = 'fg-app';

        if (previousState) {
            removeApplicationNode(appRootTagName);
            removeNgStyles();
            createNewApplicationNode(appRootTagName);
        }
    }

    return bootstrapNewApplication(appModule)
        .then((moduleRef: any) => {
            stateService = moduleRef.injector.get(stateServiceToken, {});
            router = moduleRef.injector.get(routerToken, {});

            if (stateService && stateService.now && previousState) {
                previousState = { ...previousState };
                stateService['store'].replaceState(previousState);
                router.navigateByUrl(previousUrl);
            }
        });
}

function removeApplicationNode(tagName: string) {
    const appRootNode = document.getElementsByTagName(tagName)[0];
    if (appRootNode) {
        appRootNode.parentNode.removeChild(appRootNode);
    }
}

function createNewApplicationNode(tagName: string) {
    const newAppRootNode = document.createElement(tagName);
    document.getElementsByTagName('body')[0].insertAdjacentElement('afterbegin', newAppRootNode);
}

function bootstrapNewApplication(newAppModule: any) {
    return platformBrowserDynamic().bootstrapModule(newAppModule);
}

function removeNgStyles() {
    const docHead = document.head;
    const stylesNodeList = docHead.querySelectorAll('style');
    const styles = Array.prototype.slice.call(stylesNodeList);
    styles
        .filter((style: any) => style.innerText.indexOf('_ng') !== -1)
        .map((el: any) => docHead.removeChild(el));
}
