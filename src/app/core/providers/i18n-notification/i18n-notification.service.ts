import { Injectable } from '@angular/core';
import { INotificationOptions, Notification as BaseNotification } from 'gentics-ui-core';
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

    constructor(private notification: BaseNotification,
                private i18n: I18nService) {
    }

    /**
     * Display a toast with the `message` property being passed through the I18nService#translate()
     * method. Optional translation parameters can be provided.
     */
    show(options: TranslatedNotificationOptions): { dismiss: () => void; } {
        options.message = this.i18n.translate(options.message, options.translationParams);
        if (options.action && options.action.label) {
            options.action.label = this.i18n.translate(options.action.label, options.translationParams);
        }
        return this.notification.show(options);
    }

    destroyAllToasts(): void {
        this.notification.destroyAllToasts();
    }
}
