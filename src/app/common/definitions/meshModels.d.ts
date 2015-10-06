module meshAdminUi {

    export interface INodeReference {
        name: string;
        uuid: string;
    }

    export interface ITags {
        [tagFamily: string]: {
            uuid: string;
            items: Array<{
                name: string;
                uuid: string;
            }>;
        };
    }

    export interface INodeFields {
        [name: string]: any;
    }

    export interface INode {
        uuid: string;
        children?: string[];
        creator: INodeReference;
        created: number;
        displayField?: string;
        editor: INodeReference;
        edited: number;
        language: string;
        permissions: string[];
        published: boolean;
        tags: ITags;
        schema: INodeReference;
        container: boolean;
        parentNodeUuid: string;
        parentNode: {
            uuid: string;
        };
        fields: INodeFields
    }

    export interface ISchemaFieldDefinition {
        name: string;
        type: string;
        label?: string;
        required?: boolean;
        defaultValue?: any;
        min?: number;
        max?: number;
        step?: number;
        options?: string[];
        allow?: string[];
        listType?: string;
        microschemaType?: string;
    }

    export interface ISchema {
        binary: boolean;
        displayField: string;
        fields: ISchemaFieldDefinition[];
        folder: boolean;
        meshVersion: string;
        name: string;
        permissions: string[];
        projects: any[]
        uuid: string;
    }

    export interface INodeFieldModel extends ISchemaFieldDefinition{
        value: any;
        path: string[];
        canUpdate: boolean;
        isDisplayField: boolean;
        update: (value: any) => void;
    }

}