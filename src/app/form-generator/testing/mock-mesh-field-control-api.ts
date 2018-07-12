/// <reference types="jasmine"/>
import { SchemaField } from '../../common/models/schema.model';
import { UILanguage } from '../../core/providers/i18n/i18n.service';
import { MeshFieldControlApi, SchemaFieldPath } from '../common/form-generator-models';
import createSpy = jasmine.createSpy;

export class MockMeshFieldControlApi implements MeshFieldControlApi {
    path: SchemaFieldPath = [];
    field: SchemaField = {
        name: 'test',
        type: 'string'
    };
    readOnly = false;
    getValue = createSpy('getValue');
    setValue = createSpy('setValue');
    onValueChange = createSpy('onValueChange');
    getNodeValue = createSpy('getNodeValue');
    onNodeChange = createSpy('onNodeChange');
    setHeight = createSpy('setHeight');
    setWidth = createSpy('setWidth');
    setFocus = createSpy('setFocus');
    setError = createSpy('setError');
    onLabelClick = createSpy('onLabelClick');
    onFormWidthChange = createSpy('onFormWidthChange');
    appendDefaultStyles = createSpy('appendDefaultStyles');
    uiLanguage: UILanguage;
    openNodeBrowser = createSpy('openNodeBrowser');
}
