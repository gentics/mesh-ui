import { TreeNode } from 'primeng/api';

type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

type GtxTreeNode<T> = Modify<
    TreeNode,
    {
        data: T;
    }
>;

// TODO Replace with <const> in TS >= 3.4
export const basePermissions = ['create', 'read', 'update', 'delete'] as ['create', 'read', 'update', 'delete'];
export const nodePermissions = [...basePermissions, 'publish', 'readPublished'] as [
    'create',
    'read',
    'update',
    'delete',
    'publish',
    'readPublished'
];

export type BasePermission = typeof basePermissions[number];
export type NodePermission = typeof nodePermissions[number];

export function isBasePermission(perm: string): perm is BasePermission {
    return basePermissions.indexOf(perm as any) >= 0;
}

export function isNodePermission(perm: string): perm is NodePermission {
    return nodePermissions.indexOf(perm as any) >= 0;
}

export const commonColumns = [
    {
        field: 'name',
        header: 'Name'
    },
    ...createColumns(['create', 'read', 'update', 'delete'])
];

export function createColumns(permissionNames: string[]) {
    return permissionNames.map(key => ({
        field: key,
        header: key,
        iconName: mapKeyToIconName(key)
    }));
}

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
            return 'cloud';
        case 'readPublished':
            return 'cloud_done';
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
