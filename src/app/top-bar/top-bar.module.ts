import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@NgModule({
    declarations: [
        LanguageSwitcherComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        LanguageSwitcherComponent
    ]
})
export class TopBarModule {
}
