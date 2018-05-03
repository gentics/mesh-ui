import { initializeFieldValue } from './initialize-field-value';
import { SchemaField } from '../../common/models/schema.model';

describe('initializeFieldValue()', () => {
    it('returns correct value for string field', () => {
        const field = { type: 'string' } as SchemaField;
        expect(initializeFieldValue(field)).toBe('');
    });

    it('returns correct value for html field', () => {
        const field = { type: 'html' } as SchemaField;
        expect(initializeFieldValue(field)).toBe('');
    });

    it('returns correct value for boolean field', () => {
        const field = { type: 'boolean' } as SchemaField;
        expect(initializeFieldValue(field)).toBe(false);
    });

    it('returns correct value for number field', () => {
        const field = { type: 'number' } as SchemaField;
        expect(initializeFieldValue(field)).toBe(0);
    });

    it('returns correct value for number field with min', () => {
        const field = { type: 'number', min: 20 } as SchemaField;
        expect(initializeFieldValue(field)).toBe(20);
    });

    it('returns correct value for boolean field', () => {
        const field = { type: 'boolean' } as SchemaField;
        expect(initializeFieldValue(field)).toBe(false);
    });

    it('returns correct value for node field', () => {
        const field = { type: 'node' } as SchemaField;
        expect(initializeFieldValue(field)).toBe(null);
    });

    it('returns correct value for binary field', () => {
        const field = { type: 'node' } as SchemaField;
        expect(initializeFieldValue(field)).toBe(null);
    });

    it('returns correct value for date field', () => {
        const field = { type: 'date' } as SchemaField;
        const result = initializeFieldValue(field);
        const actual = new Date(result).toDateString();
        const expected = new Date().toDateString();
        expect(actual).toBe(expected);
    });

    it('returns correct value for string list field', () => {
        const field = { type: 'list', listType: 'string' } as SchemaField;
        expect(initializeFieldValue(field)).toEqual(['']);
    });

    it('uses defaultValue if set', () => {
        const field = { type: 'string', defaultValue: 'foo' } as SchemaField;
        expect(initializeFieldValue(field)).toBe('foo');
    });
});
