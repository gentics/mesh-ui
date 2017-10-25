declare module meshAdminUi {

    interface IPermissions {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
        publish: boolean;
        readPublished: boolean;
    }

    // properties common to all Mesh nodes
    interface IMeshBaseProps {
        uuid?: string;
        creator?: IReference;
        created?: number;
        editor?: IReference;
        edited?: number;
        permissions?: IPermissions;
        rolePerms?: IPermissions;
    }

    export interface IReference {
        uuid: string;
    }

    export interface IProject extends IMeshBaseProps {
        name: string;
        rootNode: IExtendedNodeReference;
    }

    export interface INodeReference extends IReference{
        name: string;
    }

    export interface ITagFamilyReference extends INodeReference {}

    export interface ITagReference {
        name: string;
        tagFamily: string;
        uuid: string;
    }

    export interface IExtendedNodeReference {
        uuid: string;
        projectName?: string;
        schema?: {
            name: string;
            uuid: string;
        }
    }

    export interface INodeFields {
        [name: string]: any;
    }

    export interface IBinaryField {
        fileName: string;
        fileSize: number;
        mimeType: string;
        sha512sum: string;
        type: string;
        dpi?: number;
        height?: number;
        width?: number;
    }

    export interface INodeTagsObject {
        [tagFamilyName: string]: {
            items: INodeReference[];
            uuid: string;
        };
    }

    export interface INode extends IMeshBaseProps{
        availableLanguages?: {
            [languageCode: string]: {
                published: boolean;
                version: string;
            }
        };
        childrenInfo?: {
            [schemaName: string]: {
                count: number;
                schemaUuid: string;
            };
        };
        fileName?: string;
        displayField?: string;
        language?: string;
        languagePaths?: {
            [lang: string]: string;
        };
        tags?: ITagReference[];
        schema: INodeReference;
        container?: boolean;
        parentNode?: IExtendedNodeReference;
        fields: INodeFields;
        version?: string;
    }

    export interface IPublishedResponse {
        availableLanguages: {
            [languageCode: string]: {
                publishDate: string;
                published: boolean;
                publisher: IReference;
                version: string;
            }
        }
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
        displayField: string;
        segmentField: string;
        urlFields: string[];
        fields: ISchemaFieldDefinition[];
        container: boolean;
        meshVersion?: string;
        name: string;
        permissions?: IPermissions;
        uuid?: string;
    }

    export interface IMicroschema {
        name: string;
        fields: ISchemaFieldDefinition[];
        permissions?: IPermissions;
        uuid?: string;
        /**
         * Used when creating a new micronode in order to allow efficient change
         * tracking before the node has been created in Mesh and assigned a real uuid.
         */
        tempId?: string;
    }

    export interface ITag extends IMeshBaseProps {
        tagFamily: ITagFamilyReference;
        name: string;
    }

    export interface ITagFamily extends IMeshBaseProps {
        name: string;
    }

    export interface INodeFieldModel extends ISchemaFieldDefinition{
        id: string;
        value: any;
        path: (string|number)[];
        canUpdate: boolean;
        isDisplayField: boolean;
        projectName: string;
        node: INode;
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

    /**
     * Params that can be passed to the Mesg image API
     */
    export interface IImageOptions {
        width?: number;
        height?: number;
    }

}