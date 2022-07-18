import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';

import { AudioPlayButtonComponent } from './components/audio-play-button/audio-play-button.component';
import { AvailableLanguagesListComponent } from './components/available-languages-list/available-languages-list.component';
import { ChipComponent } from './components/chip/chip.component';
import { ContentPortalComponent } from './components/content-portal/content-portal.component';
import { FilePreviewComponent } from './components/file-preview/file-preview.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { IconCheckboxComponent } from './components/icon-checkbox/icon-checkbox.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { NodeBrowserListComponent } from './components/node-browser/node-browser-list/node-browser-list.component';
import { NodeBrowserComponent } from './components/node-browser/node-browser.component';
import { NodeStatusComponent } from './components/node-status/node-status.component';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';
import { PermissionIconCheckboxComponent } from './components/permission-icon-checkbox/permission-icon-checkbox.component';
import { PublishAllOptionsComponent } from './components/publish-all-options/publish-all-options.component';
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
import { I18nPipe } from './pipes/i18n/i18n.pipe';
import { NodeStatusPipe } from './pipes/node-status/node-status.pipe';

const COMPONENTS = [NodeBrowserListComponent];

const SHARED_COMPONENTS = [
    AudioPlayButtonComponent,
    AvailableLanguagesListComponent,
    ChipComponent,
    ContentPortalComponent,
    FilePreviewComponent,
    HighlightComponent,
    IconCheckboxComponent,
    NoContentComponent,
    NodeStatusComponent,
    PaginationControlsComponent,
    PermissionIconCheckboxComponent,
    PublishAllOptionsComponent,
    PublishOptionsComponent,
    SchemaLabelComponent,
    TagComponent,
    TagSelectorComponent,
    ThumbnailComponent
];

const ENTRY_COMPONENTS = [NodeBrowserComponent];

const SHARED_DIRECTIVES = [
    ScrollFrameDirective,
    ScrollFrameHeadingDirective,
    BackgroundFromDirective,
    ProjectContentDirective
];

const SHARED_PIPES = [DisplayFieldPipe, FileSizePipe, I18nPipe, NodeStatusPipe];

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
        NgxPaginationModule,
        TranslateModule
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
