import { SchemaCreateRequest } from '../src/app/common/models/server-models';

// Schemas used for testing

export const SingleNodeFieldList = {
    name: 'SingleNodeFieldListSchema',
    fields: [
        {
            name: 'nodes',
            type: 'list',
            listType: 'node'
        }
    ]
};

export const SingleHtmlFieldList = {
    name: 'SingleHtmlFieldListSchema',
    fields: [
        {
            name: 'nodes',
            type: 'list',
            listType: 'html'
        }
    ]
};

export const allFields: SchemaCreateRequest = {
    name: 'allFields',
    fields: [
        {
            name: 'binaryField',
            type: 'binary'
        },
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
            name: 'micronodeField',
            type: 'micronode',
            allow: ['allMicroFields']
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
            name: 'micronodeListField',
            type: 'list',
            listType: 'micronode',
            allow: ['allMicroFields']
        },
        {
            name: 'nodeListField',
            type: 'list',
            listType: 'node'
        }
    ]
};
