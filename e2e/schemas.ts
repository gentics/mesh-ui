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

export const AllFields = {
    name: 'AllFields',
    fields: [
        {
            name: 'string',
            required: false,
            type: 'string'
        },
        {
            name: 'number',
            required: false,
            type: 'number'
        },
        {
            name: 'binary',
            required: false,
            type: 'binary'
        },
        {
            name: 'date',
            required: false,
            type: 'date'
        },
        {
            name: 'node',
            required: false,
            type: 'node'
        },
        {
            name: 'micronode',
            required: false,
            type: 'micronode'
        },
        {
            name: 'html',
            required: false,
            type: 'html'
        },
        {
            name: 'boolean',
            required: false,
            type: 'boolean'
        },
        {
            name: 'stringList',
            required: false,
            listType: 'string',
            type: 'list'
        },
        {
            name: 'numberList',
            required: false,
            listType: 'number',
            type: 'list'
        },
        {
            name: 'dateList',
            required: false,
            listType: 'date',
            type: 'list'
        },
        {
            name: 'nodeList',
            required: false,
            listType: 'node',
            type: 'list'
        },
        {
            name: 'micronodeList',
            required: false,
            listType: 'micronode',
            type: 'list'
        },
        {
            name: 'htmlList',
            required: false,
            listType: 'html',
            type: 'list'
        },
        {
            name: 'booleanList',
            required: false,
            listType: 'boolean',
            type: 'list'
        }
    ]
};
