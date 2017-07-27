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
        expect(fieldsAreEqual({
            uuid: 'uuid1',
            microschema: {name: 'test', uuid: 'test'},
            fields: {name: 'foo'}
        }, {
            uuid: 'uuid1',
            microschema: {name: 'test', uuid: 'test'},
            fields: {name: 'foo'}
        })).toBe(true, 'all equal');

        expect(fieldsAreEqual({
            uuid: 'uuid1',
            microschema: {name: 'test', uuid: 'test'},
            fields: {name: 'foo'}
        }, {
            uuid: 'new_uuid',
            microschema: {name: 'test', uuid: 'test'},
            fields: {name: 'foo'}
        })).toBe(true, 'fields equal, uuid changed');

        expect(fieldsAreEqual({
            uuid: 'uuid1',
            microschema: {name: 'test', uuid: 'test'},
            fields: {name: 'foo'}
        }, {
            uuid: 'uuid1',
            microschema: {name: 'test', uuid: 'test'},
            fields: {name: 'bar'}
        })).toBe(false, 'fields changed');

    });

});
