import { MeshNode } from '../../../common/models/node.model';

import { DisplayFieldPipe } from './display-field.pipe';

describe('DisplayFieldPipe', () => {
    it('transforms to an empty string for undefined input', () => {
        const pipe = new DisplayFieldPipe();
        expect(pipe.transform(undefined as any)).toEqual('');
    });

    it('transforms to an empty string for null input', () => {
        const pipe = new DisplayFieldPipe();
        expect(pipe.transform(null as any)).toEqual('');
    });

    it('returns the uuid for nodes without a displayField', () => {
        const pipe = new DisplayFieldPipe();
        const input: any = {
            uuid: 'uuid-1234',
            fields: {
                prettyName: 'Node with UUID 1234'
            }
        };

        expect(pipe.transform(input)).toEqual('uuid-1234');
    });

    it('returns the value of the display field for nodes with a displayField', () => {
        const pipe = new DisplayFieldPipe();
        const input: any = {
            uuid: 'uuid-1234',
            fields: {
                prettyName: 'Node with UUID 1234'
            },
            displayField: 'prettyName'
        };
        expect(pipe.transform(input)).toEqual('Node with UUID 1234');
    });

    it('returns the uuid for nodes where the displayField equals null', () => {
        const pipe = new DisplayFieldPipe();
        const input: any = {
            uuid: 'uuid-1234',
            fields: {
                prettyName: null
            },
            displayField: 'prettyName'
        };
        expect(pipe.transform(input)).toEqual('uuid-1234');
    });

    it('returns the uuid for nodes where the displayField equals undefined', () => {
        const pipe = new DisplayFieldPipe();
        const input: any = {
            uuid: 'uuid-1234',
            fields: {
                prettyName: undefined
            },
            displayField: 'prettyName'
        };
        expect(pipe.transform(input)).toEqual('uuid-1234');
    });
});
