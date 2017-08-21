import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService, OverlayHostService } from 'gentics-ui-core';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ConfirmNavigationModalComponent } from './components/confirm-navigation-modal/confirm-navigation-modal.component';
import { ContainerContentsComponent } from './components/container-contents/container-contents.component';
import { EditorEffectsService } from './providers/editor-effects.service';
import { FormGeneratorModule } from './form-generator/form-generator.module';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { NodeEditorGuard } from './providers/node-editor-guard';
import { NodeLanguageLabelComponent } from './components/node-language-label/node-language-label.component';
import { NodeLanguageSwitcherComponent } from './components/node-language-switcher/node-language-switcher.component';
import { ProjectSwitcherComponent } from './components/project-switcher/project-switcher.component';
import { routes } from './editor.routes';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SharedModule } from '../shared/shared.module';
import { VersionLabelComponent } from './components/version-label/version-label.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormGeneratorModule
    ],
    declarations: [
        BreadcrumbsComponent,
        ConfirmNavigationModalComponent,
        ContainerContentsComponent,
        MasterDetailComponent,
        NodeEditorComponent,
        NodeLanguageLabelComponent,
        NodeLanguageSwitcherComponent,
        ProjectSwitcherComponent,
        SearchBarComponent,
        VersionLabelComponent
    ],
    entryComponents: [
        ConfirmNavigationModalComponent
    ],
    providers: [
        EditorEffectsService,
        NodeEditorGuard,
        ModalService,
        OverlayHostService
    ]
})
export class EditorModule {
    public static routes = routes;
}
