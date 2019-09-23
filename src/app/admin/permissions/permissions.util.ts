import { TreeNode } from 'primeng/api';

type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

type GtxTreeNode<T> = Modify<
    TreeNode,
    {
        data: T;
    }
>;

export const commonColumns = [
    {
        field: 'name',
        header: 'Name'
    },
    ...['create', 'read', 'update', 'delete'].map(key => ({
        field: key,
        header: key,
        iconName: mapKeyToIconName(key)
    }))
];

export function mapKeyToIconName(key: string): string {
    switch (key) {
        case 'create':
            return 'add';
        case 'read':
            return 'remove_red_eye';
        case 'update':
            return 'edit';
        case 'delete':
            return 'delete';
        case 'publish':
            return 'cloud_upload';
        case 'readPublish':
            return 'cloud_done';
        case 'canCreateNewTagFamilies':
            return 'local_offer';
        default:
            return '';
    }
}

/**
 * This is used for everything besides projects, tags and nodes.
 * @param entity
 */
export function simpleQuery(entity: string) {
    const nameField = entity === 'users' ? 'username' : 'name';
    return `query rolePerms($roleUuid: String!) {
        entity: ${entity} {
            elements {
            uuid
            name: ${nameField}
            rolePerms(role: $roleUuid) {
                create
                read
                update
                delete
            }
            }
        }
    }`;
}
