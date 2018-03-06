import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { NoContentComponent } from './components/no-content/no-content.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { DisplayFieldPipe } from './pipes/display-field/display-field.pipe';
import { I18nPipe } from './pipes/i18n/i18n.pipe';
import { ScrollFrameDirective } from './components/scroll-frame/scroll-frame.directive';
import { ScrollFrameHeadingDirective } from './components/scroll-frame/scroll-frame-heading.directive';
import { SchemaLabelComponent } from './components/schema-label/schema-label.component';
import { BackgroundFromDirective } from './directives/background-from.directive';
import { HighlightPipe } from './pipes/highlight/highlight.pipe';

const SHARED_COMPONENTS = [
    NoContentComponent,
    SchemaLabelComponent,
    ThumbnailComponent
];

const SHARED_DIRECTIVES = [
    ScrollFrameDirective,
    ScrollFrameHeadingDirective,
    BackgroundFromDirective
];

const SHARED_PIPES = [
    DisplayFieldPipe,
    I18nPipe,
    HighlightPipe
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
        ...SHARED_DIRECTIVES,
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
