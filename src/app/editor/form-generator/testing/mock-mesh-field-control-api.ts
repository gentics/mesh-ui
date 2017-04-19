///<reference types="jasmine"/>
import { SchemaFieldPath } from '../common/form-generator-models';
import { SchemaField } from '../../../common/models/schema.model';
import createSpy = jasmine.createSpy;

export class MockMeshFieldControlApi {
    path: SchemaFieldPath = [];
    field: SchemaField = {
        name: 'test',
        type: 'string'
    };
    getValue = createSpy('getValue');
    setValue = createSpy('setValue');
    onValueChange = createSpy('onValueChange');
    setHeight = createSpy('setHeight');
    setWidth = createSpy('setWidth');
    setValid = createSpy('setValid');
    onFormWidthChange = createSpy('onFormWidthChange');
}
