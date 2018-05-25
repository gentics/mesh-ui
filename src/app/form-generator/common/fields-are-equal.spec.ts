import { NodeFieldMicronode } from '../../common/models/node.model';

import { fieldsAreEqual } from './fields-are-equal';

describe('fieldsAreEqual()', () => {
    it('works with primitive field types', () => {
        expect(fieldsAreEqual(1, 1)).toBe(true);
        expect(fieldsAreEqual('foo', 'bar')).toBe(false);
        expect(fieldsAreEqual(true, true)).toBe(true);
    });

    it('works with list fields', () => {
        expect(fieldsAreEqual([1, 2], [1, 2])).toBe(true);
        expect(fieldsAreEqual([1, 2], [2, 1])).toBe(false);
    });

    it('works with micronode fields', () => {
        const field1: NodeFieldMicronode = {
            uuid: 'uuid1',
            microschema: { name: 'test', uuid: 'test', version: '1.0' },
            fields: { name: 'foo' }
        };

        const field2: NodeFieldMicronode = {
            uuid: 'new_uuid',
            microschema: { name: 'test', uuid: 'test', version: '1.0' },
            fields: { name: 'foo' }
        };

        const field3: NodeFieldMicronode = {
            uuid: 'uuid1',
            microschema: { name: 'test', uuid: 'test', version: '1.0' },
            fields: { name: 'bar' }
        };

        expect(fieldsAreEqual(field1, field1)).toBe(true, 'all equal');

        expect(fieldsAreEqual(field1, field2)).toBe(true, 'fields equal, uuid changed');

        expect(fieldsAreEqual(field1, field3)).toBe(false, 'fields changed');
    });
});
