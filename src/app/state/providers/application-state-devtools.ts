import { Injectable } from '@angular/core';
import { logMethodCallToConsole } from 'immutablets';
import { Subscription } from 'rxjs';

import { AppState } from '../models/app-state.model';

import { ApplicationStateService } from './application-state.service';

declare var window: Window & {
    meshui: {
        logging: boolean;
        state: AppState;
    };
};

/**
 * Debugging tools for the app state.
 *
 * In the browser console, use:
 * - `meshui.state` to output the app state
 * - `meshui.state = {...}` to change the app state
 * - `meshui.logging = true/false` to enable/disable logging
 */
@Injectable()
export class ApplicationStateDevtools {
    constructor(private appState: ApplicationStateService) {
        if (!window.meshui) {
            window.meshui = {} as any;
        }

        this.exposeCurrentState();
        this.exposeStateLogging();
    }

    private exposeCurrentState() {
        // For debugging purposes, we expose the app state as a window global
        Object.defineProperty(window.meshui, 'state', {
            get: () => this.appState.now,
            set: (newState: AppState) => this.appState.restore(newState)
        });
    }

    private exposeStateLogging() {
        const LOCAL_STORAGE_KEY = 'meshui_log_state';
        let loggingEnabled = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
        let subscription: Subscription;

        const toggle = (enable: boolean) => {
            loggingEnabled = enable;
            if (subscription) {
                subscription.unsubscribe();
            }
            if (enable) {
                subscription = this.appState.observeMethodCalls().subscribe(logMethodCallToConsole);
            }
        };

        Object.defineProperty(window.meshui, 'logging', {
            get: () => loggingEnabled,
            set: (value: any) => {
                toggle(Boolean(value) && value !== 'false');
                if (loggingEnabled) {
                    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
                } else {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                }
            }
        });

        toggle(loggingEnabled);
    }
}
