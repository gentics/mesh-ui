import { Injectable } from '@angular/core';
import { INotificationOptions, Notification as BaseNotification } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { OperatorFunction } from 'rxjs/interfaces';

import { I18nService } from '../i18n/i18n.service';

export interface TranslatedNotificationOptions extends INotificationOptions {
    translationParams?: { [key: string]: any };
}

/**
 * A drop-in replacement for the GUIC Notification service, which is able to transparently
 * translate translation keys passed in the `message` property of the options object.
 */
@Injectable()
export class I18nNotification {
    constructor(private notification: BaseNotification, private i18n: I18nService) {
        this.rxError = this.rxError.bind(this);
    }

    /**
     * Display a toast with the `message` property being passed through the I18nService#translate()
     * method. Optional translation parameters can be provided.
     */
    show(options: TranslatedNotificationOptions): { dismiss: () => void } {
        options.message = this.i18n.translate(options.message, options.translationParams);
        if (options.action && options.action.label) {
            options.action.label = this.i18n.translate(options.action.label, options.translationParams);
        }
        return this.notification.show(options);
    }

    /**
     * To be used with Observable.pipe.
     * Displays an error notification when the observable emits an error.
     */
    rxError<T>(source: Observable<T>): Observable<T> {
        return source.do({
            error: (err: any) =>
                this.notification.show({
                    type: 'error',
                    message: String(err)
                })
        });
    }

    /**
     * To be used with Observable.pipe.
     * Displays an error notification when the observable emits an error.
     * If successKey is set, a success notification with the given key is displayed on the complete event.
     */
    rxSuccess<T>(successKey: string, translationParams?: { [key: string]: any }): OperatorFunction<T, T> {
        return source =>
            source.do({
                complete: () =>
                    this.show({
                        type: 'success',
                        message: successKey,
                        translationParams
                    })
            });
    }

    /**
     * To be used with Observable.pipe.
     * If successKey is set, a success notification with the given key is displayed on the next event.
     * @param translationParamsMapper Maps the emitted item to the translation parameters
     */
    rxSuccessNext<T>(successKey: string, translationParamsMapper: (emittedItem: T) => any): OperatorFunction<T, T> {
        return source =>
            source.do({
                next: item =>
                    this.show({
                        type: 'success',
                        message: successKey,
                        translationParams: translationParamsMapper(item)
                    })
            });
    }

    /**
     * Displays a success notification when a promise has been resolved.
     * Usage example:
     * `promise.then(promiseSuccess('editor.node_saved'))`
     */
    promiseSuccess<T>(i18nKey: string, translationParams?: { [key: string]: any }): (result: T) => T | PromiseLike<T> {
        return val => {
            this.show({
                type: 'success',
                message: i18nKey,
                translationParams
            });
            return val;
        };
    }

    destroyAllToasts(): void {
        this.notification.destroyAllToasts();
    }
}
