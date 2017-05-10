import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { CustomLoader } from '../shared/providers/i18n/custom-loader';
import { NavigationService } from '../shared/providers/navigation/navigation.service';
import { I18nService } from '../shared/providers/i18n/i18n.service';
import { ENV_PROVIDERS } from '../environment';
import { AuthGuard } from '../shared/providers/guards/auth-guard';
import { ApplicationStateService } from '../state/providers/application-state.service';
import { SharedModule } from '../shared/shared.module';
import { ApiService } from '../shared/providers/api/api.service';
import { ApiBase } from '../shared/providers/api/api-base.service';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { AuthEffectsService } from '../login/providers/auth-effects.service';

// Application wide providers
const CORE_PROVIDERS = [
    ApplicationStateService,
    AuthGuard,
    I18nService,
    NavigationService,
    AuthEffectsService,
    ApiService,
    ApiBase,
    ENV_PROVIDERS,
];

const CORE_COMPONENTS = [
    LanguageSwitcherComponent,
    UserDropdownComponent
];

const CORE_ENTRY_COMPONENTS = [
    ChangePasswordModalComponent
];

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
    providers: CORE_PROVIDERS,
})
export class CoreModule {
    /**
     * Throw an exception if someone tries to import the CoreModule into any child module.
     */
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
      if (parentModule) {
        throw new Error('CoreModule is already loaded. Import it in the AppModule only');
      }
    }
}
