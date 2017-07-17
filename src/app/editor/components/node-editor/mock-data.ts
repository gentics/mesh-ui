import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
/**
 * Some hard-coded mock data used for developing the FormGenerator module.
 */

export const testNode: MeshNode = {
    uuid : '21203632520b4d19a03632520b2d19c1',
    creator : {
        uuid : '344af82020cf4f6c8af82020cf7f6c76'
    } as any,
    created : '2017-07-07T12:18:54Z',
    editor : {
        uuid : '344af82020cf4f6c8af82020cf7f6c76'
    },
    edited : '2017-07-07T12:18:55Z',
    language : 'en',
    availableLanguages : [ 'en' ],
    parentNode : {
        projectName : 'demo',
        uuid : 'f183fc2da8014c2383fc2da8011c2392',
        schema : {
            name : 'folder',
            uuid : 'c16bb4d872564963abb4d872566963e2'
        }
    },
    tags : [ ],
    project : {
        name : 'demo',
        uuid : '217f8c981ada4642bf8c981adaa642c3'
    },
    childrenInfo : {
        vehicle : {
            schemaUuid : '2aa83a2b3cba40a1a83a2b3cba90a1de',
            count : 3
        }
    },
    rolePerms: undefined as any,
    schema : {
        name : 'category',
        uuid : '2ca2362b041247c4a2362b041227c4da',
        version : 1
    },
    container : true,
    displayField : 'name',
    fields : {
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
    } as any,
    breadcrumb : [ ],
    version : '1.0',
    permissions : {
        create : true,
        read : true,
        update : true,
        delete : true,
        publish : true,
        readPublished : true
    }
};

export const testSchema: Schema = {
    created: '18513.51-4321325-1-1243-151-251-Z',
    creator: undefined as any,
    edited: undefined as any,
    editor: undefined as any,
    uuid: 'b85a103e9902460e9a103e9902b60eee',
    permissions: {
        create: true,
        update: true,
        delete: true,
        readPublished: true,
        read: true,
        publish: true,
    },
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
                use: 'slug',
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
               use: 'slider'
            }
        },
        {
            name: 'in_stock',
            label: 'In Stock',
            required: false,
            type: 'boolean',
            control: {
               use: 'vue-checkbox'
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
               use: 'geolocation'
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
