/**
 * Some hard-coded mock data used for developing the FormGenerator module.
 */

export const testNode: any = {
    uuid: '6b415925881043f1815925881063f147',
    creator: {
        uuid: 'ab4d3343ee834f128d3343ee834f12d6'
    },
    created: '2017-01-19T12:08:02Z',
    editor: {
        uuid: 'ab4d3343ee834f128d3343ee834f12d6'
    },
    edited: '2017-01-19T12:08:05Z',
    permissions: [
        'create',
        'update',
        'delete',
        'readpublished',
        'read',
        'publish'
    ],
    language: 'en',
    availableLanguages: [
        'en'
    ],
    parentNode: {
        projectName: 'demo',
        uuid: '69e74dfa02a24a1da74dfa02a2aa1d6f',
        displayName: 'Aircraft',
        schema: {
            name: 'category',
            uuid: '1c401518014a407d801518014a507d2b'
        }
    },
    tags: {
        Colors: {
            uuid: '424997f976e54e2c8997f976e58e2c82',
            items: [
                {
                    name: 'White',
                    uuid: '0285966a7eb0466b85966a7eb0766be8'
                }
            ]
        },
        Fuels: {
            uuid: 'c7bcb1469f9747c0bcb1469f9727c0b2',
            items: [
                {
                    name: 'Kerosene',
                    uuid: '33ad0f52e6324192ad0f52e63251922e'
                }
            ]
        }
    },
    childrenInfo: {},
    schema: {
        name: 'vehicle',
        uuid: 'b85a103e9902460e9a103e9902b60eee',
        version: 1
    },
    displayField: 'name',
    fields: {
        name: 'Gulfstream G550',
        slug: '',
        description: `The Gulfstream G500 and G550 are business jet aircraft 
                produced by General Dynamics' Gulfstream Aerospace unit in Savannah, Georgia.`,
        weight: 21900,
        in_stock: true,
        price: 42000000,
        created: '2017-02-06T14:15:19+00:00',
        attachment: {
            fileName: 'flower.jpg',
            width: 800,
            height: 600,
            sha512sum: 'ec582eb760034dd91d5fd33656c0b56f082b7365d32e2a139dd9c87ebc192bff3525f32ff4c4137463a31cad020ac19e6e356508db2b90e32d737b6d725e14c1',
            fileSize: 95365,
            mimeType: 'image/jpeg',
            dpi: 200,
            type: 'binary'
        },
        aliases: [
            'alias1',
            'alias2'
        ],
        vehicleImage: {
            uuid: '4d1cabf1382e41ea9cabf1382ef1ea7c'
        },
        location: {
            uuid: '1324jnfo9u0923rhjo9que9q293hr',
            microschema: {
                name: 'geolocation',
                uuid: '95b6cbb75638477fb6cbb75638b77f96'
            },
            fields: {
                latitude: 48.21343332544704,
                longitude: 16.36980152130125,
                addresses: [
                    'Gonzagagasse'
                ]
            },
            type: 'micronode'
        },
        locations: [
            {
                uuid: '2f26db6facc047c7a6db6facc027c76b',
                microschema: {
                    name: 'geolocation',
                    uuid: '95b6cbb75638477fb6cbb75638b77f96'
                },
                fields: {
                    latitude: 48.208330230278,
                    longitude: 16.373063840833,
                    addresses: [
                        '22 Acacia Avenue',
                        '42 Deepthought Lane'
                    ]
                },
                type: 'micronode'
            },
            {
                uuid: 'eb760034dd91d5fd33656c0b56f082',
                microschema: {
                    name: 'geolocation',
                    uuid: '95b6cbb75638477fb6cbb75638b77f96'
                },
                fields: {
                    latitude: 10.0,
                    longitude: 10.0,
                    addresses: [
                        '1 Ton Lane'
                    ]
                },
                type: 'micronode'
            }
        ]
    },
    breadcrumb: [
        {
            uuid: '69e74dfa02a24a1da74dfa02a2aa1d6f',
            displayName: 'Aircraft'
        }
    ],
    version: {
        uuid: 'f6e8236c65824cd1a8236c65820cd176',
        number: '1.0'
    },
    container: false
};

export const testSchema: any = {
    uuid: 'b85a103e9902460e9a103e9902b60eee',
    permissions: [
        'create',
        'update',
        'delete',
        'readpublished',
        'read',
        'publish'
    ],
    version: 1,
    name: 'vehicle',
    fields: [
        {
            name: 'name',
            label: 'Name',
            required: true,
            type: 'string'
        },
        {
            name: 'slug',
            label: 'Slug',
            required: true,
            type: 'string',
            control: {
               // use: 'slug',
                config: {
                    target: ['name'],
                    extension: '.html'
                }
            }
        },
        {
            name: 'description',
            label: 'Description',
            required: true,
            type: 'html'
        },
        {
            name: 'weight',
            label: 'Weight',
            required: false,
            type: 'number',
            control: {
               // use: 'slider'
            }
        },
        {
            name: 'in_stock',
            label: 'In Stock',
            required: false,
            type: 'boolean',
            control: {
               // use: 'vue-checkbox'
            }
        },
        {
            name: 'price',
            label: 'Price',
            required: false,
            type: 'number',
            min: 0,
            step: 0.01
        },
        {
            name: 'created',
            label: 'Date Created',
            required: false,
            type: 'date'
        },
        {
            name: 'attachment',
            label: 'Attachment',
            required: false,
            type: 'binary'
        },
        {
            name: 'aliases',
            label: 'Aliases',
            required: false,
            type: 'list',
            listType: 'string'
        },
        {
            name: 'vehicleImage',
            label: 'Vehicle Image',
            required: false,
            type: 'node',
            allow: [
                'vehicleImage'
            ]
        },
        {
            name: 'location',
            label: 'Location',
            type: 'micronode',
            allow: ['geolocation'],
            control: {
               // use: 'geolocation'
            }
        },
        {
            name: 'locations',
            label: 'Location List',
            type: 'list',
            listType: 'micronode',
            allow: [ 'geolocation' ]
        }
    ],
    displayField: 'name',
    segmentField: 'name',
    container: false
};
