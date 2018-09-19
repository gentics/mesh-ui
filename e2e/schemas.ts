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
