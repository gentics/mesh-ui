import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenticsUICoreModule } from 'gentics-ui-core';

import { FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { StringFieldComponent } from './components/string-field/string-field.component';
import { NumberFieldComponent } from './components/number-field/number-field.component';
import { HtmlFieldComponent } from './components/html-field/html-field.component';
import { ListFieldComponent } from './components/list-field/list-field.component';
import { FieldGeneratorService } from './providers/field-generator/field-generator.service';
import { MicronodeFieldComponent } from './components/micronode-field/micronode-field.component';
import { FieldControlGroupService } from './providers/field-control-group/field-control-group.service';
import { BooleanFieldComponent } from './components/boolean-field/boolean-field.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { FormsModule } from '@angular/forms';
import { NodeFieldComponent } from './components/node-field/node-field.component';
import { BinaryFieldComponent } from './components/binary-field/binary-field.component';

const ENTRY_COMPONENTS = [
    BinaryFieldComponent,
    BooleanFieldComponent,
    DateFieldComponent,
    HtmlFieldComponent,
    ListFieldComponent,
    MicronodeFieldComponent,
    NodeFieldComponent,
    NumberFieldComponent,
    StringFieldComponent
];

@NgModule({
    imports: [GenticsUICoreModule, CommonModule, FormsModule],
    declarations: [FormGeneratorComponent, ...ENTRY_COMPONENTS],
    entryComponents: ENTRY_COMPONENTS,
    providers: [FieldGeneratorService, FieldControlGroupService],
    exports: [FormGeneratorComponent]
})
export class FormGeneratorModule {}
