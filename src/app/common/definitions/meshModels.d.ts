declare module meshAdminUi {

    // properties common to all Mesh nodes
    interface IMeshBaseProps {
        uuid?: string;
        creator?: INodeReference;
        created?: number;
        editor?: INodeReference;
        edited?: number;
        permissions?: string[];
    }

    export interface IProject extends IMeshBaseProps{
        name: string;
        rootNodeUuid: string;
    }

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

    export interface INodeTagsObject {
        [tagFamilyName: string]: {
            items: INodeReference[];
            uuid: string;
        };
    }

    export interface INode extends IMeshBaseProps{
        availableLanguages?: string[];
        childrenInfo?: {
            [schemaName: string]: {
                count: number;
                schemaUuid: string;
            };
        };
        binaryProperties?: {
            fileSize: number;
            mimeType: string;
            sha512sum: string;
        };
        fileName?: string;
        displayField?: string;
        language?: string;
        published?: boolean;
        tags?: INodeTagsObject;
        schema: INodeReference;
        container?: boolean;
        parentNodeUuid?: string;
        parentNode?: {
            uuid: string;
        };
        fields: INodeFields
    }

    export interface IListMetaInfo {
        currentPage: number;
        pageCount: number;
        perPage: number;
        totalCount: number;
    }

    export interface IListResponse<T> {
        _metainfo: IListMetaInfo,
        data: T[];
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
    }

    export interface ISchema {
        binary?: boolean;
        displayField: string;
        segmentField: string;
        fields: ISchemaFieldDefinition[];
        folder: boolean;
        meshVersion?: string;
        name: string;
        permissions?: string[];
        uuid?: string;
    }

    export interface IMicroschema {
        name: string;
        fields: ISchemaFieldDefinition[];
        permissions?: string[];
        uuid?: string;
        /**
         * Used when creating a new micronode in order to allow efficient change
         * tracking before the node has been created in Mesh and assigned a real uuid.
         */
        tempId?: string;
    }

    export interface ITag extends IMeshBaseProps {
        tagFamily: ITagFamily;
        fields: {
            name: string;
        };
    }

    export interface ITagFamily extends IMeshBaseProps{
        name: string;
    }

    export interface INodeFieldModel extends ISchemaFieldDefinition{
        id: string;
        value: any;
        path: (string|number)[];
        canUpdate: boolean;
        isDisplayField: boolean;
        onChange: Function;
        update: (value: any) => void;
        createChild: (nodeFields: INodeFields, schemaField: ISchemaFieldDefinition, path?: any[]) => INodeFieldModel;
    }

    export interface IUser extends IMeshBaseProps {
        firstname?: string;
        lastname?: string;
        username: string;
        password?: string;
        emailAddress: string;
        nodeReference?: {
            projectName : string;
            uuid : string
        };
        groups: string[];
    }

    export interface IUserGroup extends IMeshBaseProps {
        name: string;
        roles: any[];
    }

    export interface IUserRole extends IMeshBaseProps {
        name: string;
        groups: any[];
    }

}