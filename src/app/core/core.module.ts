import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { AuthEffectsService } from '../login/providers/auth-effects.service';
import { SharedModule } from '../shared/shared.module';
import { ApplicationStateService } from '../state/providers/application-state.service';

import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { ApiBase } from './providers/api/api-base.service';
import { ApiService } from './providers/api/api.service';
import { ConfigService } from './providers/config/config.service';
import { ContentPortalService } from './providers/content-portal/content-portal.service';
import { ListEffectsService } from './providers/effects/list-effects.service';
import { AuthGuard } from './providers/guards/auth-guard';
import { I18nNotification } from './providers/i18n-notification/i18n-notification.service';
import { CustomLoader } from './providers/i18n/custom-loader';
import { I18nService } from './providers/i18n/i18n.service';
import { NavigationService } from './providers/navigation/navigation.service';

// Application wide providers
const CORE_PROVIDERS = [
    ApplicationStateService,
    AuthGuard,
    ConfigService,
    I18nNotification,
    I18nService,
    NavigationService,
    AuthEffectsService,
    ListEffectsService,
    ApiService,
    ApiBase,
    ContentPortalService
];

const CORE_COMPONENTS = [LanguageSwitcherComponent, UserDropdownComponent];

const CORE_ENTRY_COMPONENTS = [ChangePasswordModalComponent];

/**
 * The CoreModule contains all the components which are used only once in the app "chrome" - e.g. top bar items.
 * It is also responsible for declaring the app-wide singleton providers. It should be imported *only* by the
 * AppModule.
 */
@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomLoader
            }
        }),
        GenticsUICoreModule.forRoot(),
        SharedModule
    ],
    declarations: [...CORE_COMPONENTS, ...CORE_ENTRY_COMPONENTS],
    entryComponents: CORE_ENTRY_COMPONENTS,
    exports: CORE_COMPONENTS,
    providers: CORE_PROVIDERS
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
    ) {
        // Throw an exception if someone tries to import the CoreModule into any child module.
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
