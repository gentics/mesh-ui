import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NoContentComponent } from './components/no-content/no-content.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { I18nPipe } from './pipes/i18n/i18n.pipe';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { RouterModule } from '@angular/router';
import { ScrollFrameDirective } from './components/scroll-frame/scroll-frame.directive';
import { ScrollFrameHeadingDirective } from './components/scroll-frame/scroll-frame-heading.directive';

const SHARED_COMPONENTS = [
    NoContentComponent,
    ThumbnailComponent
];

const SHARED_DIRECTIVES = [
    ScrollFrameDirective,
    ScrollFrameHeadingDirective
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
        ...SHARED_PIPES,
        ...SHARED_DIRECTIVES
    ],
    exports: [
        ...SHARED_COMPONENTS,
        ...SHARED_PIPES,
        ...SHARED_DIRECTIVES,
        GenticsUICoreModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class SharedModule {}
