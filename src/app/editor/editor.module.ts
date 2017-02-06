import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './editor.routes';
import { SharedModule } from '../shared/shared.module';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { FormGeneratorModule } from './form-generator/form-generator.module';

@NgModule({
    declarations: [
        MasterDetailComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormGeneratorModule
    ],
})
export class EditorModule {
    public static routes = routes;
}
