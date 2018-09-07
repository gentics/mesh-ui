import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';

import { AudioPlayButtonComponent } from './components/audio-play-button/audio-play-button.component';
import { ChipComponent } from './components/chip/chip.component';
import { ContentPortalComponent } from './components/content-portal/content-portal.component';
import { FilePreviewComponent } from './components/file-preview/file-preview.component';
import { IconCheckboxComponent } from './components/icon-checkbox/icon-checkbox.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { NodeBrowserListComponent } from './components/node-browser/node-browser-list/node-browser-list.component';
import { NodeBrowserComponent } from './components/node-browser/node-browser.component';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';
import { PublishOptionsComponent } from './components/publish-options/publish-options.component';
import { SchemaLabelComponent } from './components/schema-label/schema-label.component';
import { ScrollFrameHeadingDirective } from './components/scroll-frame/scroll-frame-heading.directive';
import { ScrollFrameDirective } from './components/scroll-frame/scroll-frame.directive';
import { TagSelectorComponent } from './components/tag-selector/tag-selector.component';
import { TagComponent } from './components/tag/tag.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { BackgroundFromDirective } from './directives/background-from.directive';
import { ProjectContentDirective } from './directives/project-content.directive';
import { DisplayFieldPipe } from './pipes/display-field/display-field.pipe';
import { FileSizePipe } from './pipes/file-size/file-size.pipe';
import { HighlightPipe } from './pipes/highlight/highlight.pipe';
import { I18nPipe } from './pipes/i18n/i18n.pipe';

const COMPONENTS = [NodeBrowserListComponent];

const SHARED_COMPONENTS = [
    ChipComponent,
    NoContentComponent,
    SchemaLabelComponent,
    TagComponent,
    TagSelectorComponent,
    ThumbnailComponent,
    AudioPlayButtonComponent,
    FilePreviewComponent,
    PaginationControlsComponent,
    ContentPortalComponent,
    IconCheckboxComponent,
    PublishOptionsComponent
];

const ENTRY_COMPONENTS = [NodeBrowserComponent];

const SHARED_DIRECTIVES = [
    ScrollFrameDirective,
    ScrollFrameHeadingDirective,
    BackgroundFromDirective,
    ProjectContentDirective
];

const SHARED_PIPES = [DisplayFieldPipe, FileSizePipe, I18nPipe, HighlightPipe];

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
        NgxPaginationModule
    ],
    declarations: [...COMPONENTS, ...SHARED_COMPONENTS, ...ENTRY_COMPONENTS, ...SHARED_PIPES, ...SHARED_DIRECTIVES],
    exports: [
        ...SHARED_COMPONENTS,
        ...SHARED_PIPES,
        ...SHARED_DIRECTIVES,
        PaginatePipe,
        GenticsUICoreModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    entryComponents: ENTRY_COMPONENTS
})
export class SharedModule {}
