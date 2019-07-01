import { MicroschemaCreateRequest } from '../src/app/common/models/server-models';

// Schemas used for testing

export const allMicroFields: MicroschemaCreateRequest = {
    name: 'allMicroFields',
    fields: [
        {
            name: 'booleanField',
            type: 'boolean'
        },
        {
            name: 'dateField',
            type: 'date'
        },
        {
            name: 'htmlField',
            type: 'html'
        },
        {
            name: 'nodeField',
            type: 'node'
        },
        {
            name: 'numberField',
            type: 'number'
        },
        {
            name: 'stringField',
            type: 'string'
        },
        {
            name: 'stringListField',
            type: 'list',
            listType: 'string'
        },
        {
            name: 'booleanListField',
            type: 'list',
            listType: 'boolean'
        },
        {
            name: 'numberListField',
            type: 'list',
            listType: 'number'
        },
        {
            name: 'dateListField',
            type: 'list',
            listType: 'date'
        },
        {
            name: 'htmlListField',
            type: 'list',
            listType: 'html'
        },
        {
            name: 'nodeListField',
            type: 'list',
            listType: 'node'
        }
    ]
};
