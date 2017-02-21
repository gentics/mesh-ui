import { SchemaField } from '../../../common/models/schema.model';
import { initializeListValue } from './initialize-list-value';

describe('initializeListValue()', () => {

    it('should throw if not passed field of type "list"', () => {
        const field = { type: 'string' } as SchemaField;
        expect(() => initializeListValue(field)).toThrow();
    });

    it('returns correct value for listType string', () => {
        const field = { type: 'list', listType: 'string' } as SchemaField;
        expect(initializeListValue(field)).toEqual('');
    });

    it('returns correct value for listType string with defaultValue', () => {
        const field = { type: 'list', listType: 'string', defaultValue: 'foo' } as SchemaField;
        expect(initializeListValue(field)).toEqual('foo');
    });

    it('returns correct value for listType number with min', () => {
        const field = { type: 'list', listType: 'number', min: 20 } as SchemaField;
        expect(initializeListValue(field)).toEqual(20);
    });

    it('should throw if listType === "micronode" but no microschema is supplied', () => {
        const field = { type: 'list', listType: 'micronode' } as SchemaField;
        expect(() => initializeListValue(field)).toThrow();
    });

    it('returns correct value for listType micronode', () => {
        const microschema = {
                   name: 'test',
                   uuid: 'test_uuid',
                   fields: [
                       { name: 'field1', type: 'string' },
                       { name: 'field2', type: 'list', listType: 'boolean' },
                       { name: 'field3', type: 'html' }
                   ]
        } as any;
        const field = { type: 'list', listType: 'micronode' } as SchemaField;

        expect(initializeListValue(field, microschema)).toEqual({
            uuid: '',
            microschema: {
                name: 'test',
                uuid: 'test_uuid',
            },
            fields: {
                field1: '',
                field2: [false],
                field3: ''
            }
        });
    });
});
