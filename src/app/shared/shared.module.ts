import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NoContentComponent } from './components/no-content/no-content.component';
import { I18nPipe } from './pipes/i18n/i18n.pipe';
import { I18nService } from './providers/i18n/i18n.service';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { CustomLoader } from './providers/i18n/custom-loader';
import { TranslateLoader, TranslateModule } from 'ng2-translate';

const SHARED_COMPONENTS = [
    NoContentComponent
];

const SHARED_PIPES = [
    I18nPipe
];

/**
 * Exposes shared components, services and modules. To be imported into the other app modules which require any of
 * this common functionality.
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useClass: CustomLoader
        })
    ],
    declarations: [
        ...SHARED_COMPONENTS,
        ...SHARED_PIPES
    ],
    providers: [
        I18nService,
    ],
    exports: [
        ...SHARED_COMPONENTS,
        ...SHARED_PIPES,
        GenticsUICoreModule,
        FormsModule,
        CommonModule
    ]
})
export class SharedModule {}
