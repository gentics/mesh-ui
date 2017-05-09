import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NoContentComponent } from './components/no-content/no-content.component';
import { I18nPipe } from './pipes/i18n/i18n.pipe';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { RouterModule } from '@angular/router';

const SHARED_COMPONENTS = [
    NoContentComponent,
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
        ReactiveFormsModule,
        GenticsUICoreModule,
        RouterModule.forChild([]),
    ],
    declarations: [
        ...SHARED_COMPONENTS,
        ...SHARED_PIPES
    ],
    exports: [
        ...SHARED_COMPONENTS,
        ...SHARED_PIPES,
        GenticsUICoreModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class SharedModule {}
