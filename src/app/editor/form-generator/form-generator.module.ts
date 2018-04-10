import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { GenticsUIImageEditorModule } from 'gentics-ui-image-editor';

import { FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { StringFieldComponent } from './components/string-field/string-field.component';
import { NumberFieldComponent } from './components/number-field/number-field.component';
import { HtmlFieldComponent } from './components/html-field/html-field.component';
import { ListFieldComponent } from './components/list-field/list-field.component';
import { FieldGeneratorService } from './providers/field-generator/field-generator.service';
import { MicronodeFieldComponent } from './components/micronode-field/micronode-field.component';
import { MeshControlGroupService } from './providers/field-control-group/mesh-control-group.service';
import { BooleanFieldComponent } from './components/boolean-field/boolean-field.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { NodeFieldComponent } from './components/node-field/node-field.component';
import { BinaryFieldComponent } from './components/binary-field/binary-field.component';
import { CustomFieldComponent } from './components/custom-field/custom-field.component';
import { SharedModule } from '../../shared/shared.module';
import { FieldErrorsComponent } from './components/field-errors/field-errors.component';
import { BaseFieldComponent } from './components/base-field/base-field.component';
import { ImageEditorModalComponent } from './components/image-editor-modal/image-editor-modal.component';

const ENTRY_COMPONENTS = [
    BinaryFieldComponent,
    BooleanFieldComponent,
    CustomFieldComponent,
    DateFieldComponent,
    FieldErrorsComponent,
    HtmlFieldComponent,
    ListFieldComponent,
    MicronodeFieldComponent,
    NodeFieldComponent,
    NumberFieldComponent,
    StringFieldComponent,
    ImageEditorModalComponent
];

@NgModule({
    imports: [GenticsUICoreModule, GenticsUIImageEditorModule, CommonModule, FormsModule, SharedModule],
    declarations: [BaseFieldComponent, FormGeneratorComponent, ...ENTRY_COMPONENTS],
    entryComponents: ENTRY_COMPONENTS,
    providers: [FieldGeneratorService, MeshControlGroupService],
    exports: [FormGeneratorComponent]
})
export class FormGeneratorModule {}
