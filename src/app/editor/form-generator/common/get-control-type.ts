import { Type } from '@angular/core';

import { SchemaFieldType } from '../../../common/models/schema.model';
import { NumberFieldComponent } from '../components/number-field/number-field.component';
import { ListFieldComponent } from '../components/list-field/list-field.component';
import { HtmlFieldComponent } from '../components/html-field/html-field.component';
import { SchemaFieldControl } from '../components/form-generator/form-generator.component';
import { StringFieldComponent } from '../components/string-field/string-field.component';
import { MicronodeFieldComponent } from '../components/micronode-field/micronode-field.component';
import { BooleanFieldComponent } from '../components/boolean-field/boolean-field.component';

type TypeComponentMap = {
    [P in SchemaFieldType]: Type<SchemaFieldControl> | null;
};

const typeComponentMap: TypeComponentMap = {
    binary: null,
    boolean: BooleanFieldComponent,
    date: null,
    html: HtmlFieldComponent,
    list: ListFieldComponent,
    micronode: MicronodeFieldComponent,
    node: null,
    number: NumberFieldComponent,
    string: StringFieldComponent
};

export function getControlType(type: SchemaFieldType): Type<SchemaFieldControl> | undefined {
    const fieldType = typeComponentMap[type];
    if (fieldType) {
        return fieldType;
    }
}
