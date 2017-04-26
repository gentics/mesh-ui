///<reference types="jasmine"/>
import { MeshFieldControlApi, SchemaFieldPath } from '../common/form-generator-models';
import { SchemaField } from '../../../common/models/schema.model';
import createSpy = jasmine.createSpy;

export class MockMeshFieldControlApi implements MeshFieldControlApi {
    path: SchemaFieldPath = [];
    field: SchemaField = {
        name: 'test',
        type: 'string'
    };
    getValue = createSpy('getValue');
    setValue = createSpy('setValue');
    onValueChange = createSpy('onValueChange');
    getNodeValue = createSpy('getNodeValue');
    onNodeChange = createSpy('onNodeChange');
    setHeight = createSpy('setHeight');
    setWidth = createSpy('setWidth');
    setValid = createSpy('setValid');
    onFormWidthChange = createSpy('onFormWidthChange');
}
