import { Type } from '@angular/core';

import { SchemaField, SchemaFieldType } from '../../common/models/schema.model';
import { NumberFieldComponent } from '../components/number-field/number-field.component';
import { ListFieldComponent } from '../components/list-field/list-field.component';
import { HtmlFieldComponent } from '../components/html-field/html-field.component';
import { StringFieldComponent } from '../components/string-field/string-field.component';
import { MicronodeFieldComponent } from '../components/micronode-field/micronode-field.component';
import { BooleanFieldComponent } from '../components/boolean-field/boolean-field.component';
import { DateFieldComponent } from '../components/date-field/date-field.component';
import { NodeFieldComponent } from '../components/node-field/node-field.component';
import { BinaryFieldComponent } from '../components/binary-field/binary-field.component';
import { CustomFieldComponent } from '../components/custom-field/custom-field.component';
import { BaseFieldComponent } from '../components/base-field/base-field.component';

type TypeComponentMap = {
    [P in SchemaFieldType]: Type<BaseFieldComponent> | null;
};

const defaultTypeComponentMap: TypeComponentMap = {
    binary: BinaryFieldComponent,
    boolean: BooleanFieldComponent,
    date: DateFieldComponent,
    html: HtmlFieldComponent,
    list: ListFieldComponent,
    micronode: MicronodeFieldComponent,
    node: NodeFieldComponent,
    number: NumberFieldComponent,
    string: StringFieldComponent
};

/**
 * Given a schema field definition, returns the component which should be used to render it.
 */
export function getControlType(field: SchemaField): Type<BaseFieldComponent> | undefined {
    const defaultFieldType = defaultTypeComponentMap[field.type];
    if (field.control && field.control.use) {
        // TODO: check for built-in variants
        // ...

        return CustomFieldComponent;
    }
    if (defaultFieldType) {
        return defaultFieldType;
    }
}
