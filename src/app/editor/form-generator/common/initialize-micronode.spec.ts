import { initializeMicronode } from './initialize-micronode';

describe('initializeMicronode()', () => {

    it('uses the microschema name and uuid', () => {
        const microschema = {
            name: 'test',
            uuid: 'test_uuid',
            fields: []
        } as any;

        expect(initializeMicronode(microschema).microschema).toEqual({
            name: microschema.name,
            uuid: microschema.uuid,
            version: '0.0'
        });
    });

    it('initializes micronode fields', () => {
        const microschema = {
            name: 'test',
            uuid: 'test_uuid',
            fields: [
                { name: 'field1', type: 'string' },
                { name: 'field2', type: 'list', listType: 'boolean' },
                { name: 'field3', type: 'html' }
            ]
        } as any;

        expect<any>(initializeMicronode(microschema).fields).toEqual({
            field1: '',
            field2: [false],
            field3: ''
        });
    });
});
