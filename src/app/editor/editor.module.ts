import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './editor.routes';
import { SharedModule } from '../shared/shared.module';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { FormGeneratorModule } from './form-generator/form-generator.module';
import { NodeEditorComponent } from './components/node-editor/node-editor.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ContainerContentsComponent } from './components/container-contents/container-contents.component';
import { EditorEffectsService } from './providers/editor-effects.service';
import { ProjectSwitcherComponent } from './components/project-switcher/project-switcher.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormGeneratorModule
    ],
    declarations: [
        ContainerContentsComponent,
        MasterDetailComponent,
        NodeEditorComponent,
        BreadcrumbsComponent,
        SearchBarComponent,
        ProjectSwitcherComponent
    ],
    providers: [
        EditorEffectsService
    ]
})
export class EditorModule {
    public static routes = routes;
}
