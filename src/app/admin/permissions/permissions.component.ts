import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/core/providers/api/api.service';

type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

type GtxTreeNode<T> = Modify<
    TreeNode,
    {
        data: T;
    }
>;

interface TreeTableData {
    projects: GtxTreeNode<MeshProjectPerms>[];
    nodes: GtxTreeNode<MeshNodePerms>[];
    tags: GtxTreeNode<MeshTagPerms>[];
    schemas: GtxTreeNode<MeshSchemaPerms>[];
    microschemas: GtxTreeNode<MeshMicroschemaPerms>[];
    users: GtxTreeNode<MeshUserPerms>[];
    groups: GtxTreeNode<MeshGroupPerms>[];
    roles: GtxTreeNode<MeshRolePerms>[];
}

interface MeshBasePerms {
    name: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

interface MeshProjectPerms extends MeshBasePerms {
    canCreateNewTagFamilies: boolean;
}

interface MeshNodePerms extends MeshBasePerms {
    publish: boolean;
    readPublish: boolean;
}

type MeshTagPerms = MeshBasePerms;

type MeshSchemaPerms = MeshBasePerms;

type MeshMicroschemaPerms = MeshBasePerms;

type MeshUserPerms = MeshBasePerms;

type MeshGroupPerms = MeshBasePerms;

type MeshRolePerms = MeshBasePerms;

@Component({
    selector: 'mesh-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent {
    roleName: string;
    commonColumns = [
        {
            field: 'name',
            header: 'Name'
        },
        ...['create', 'read', 'update', 'delete'].map(key => ({
            field: key,
            header: key,
            iconName: this.mapKeyToIconName(key)
        }))
    ];

    treeTableData: TreeTableData = {
        projects: [],
        nodes: [],
        tags: [],
        schemas: [],
        microschemas: [],
        users: [],
        groups: [],
        roles: []
    };

    constructor(private api: ApiService) {}

    checkboxClicked(event: any): void {}

    checkboxAllClicked(event: any): void {}

    private mapKeyToIconName(key: string): string {
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

    public loadEntities(index: number) {
        switch (index) {
            case 0: // Projects
                return this.loadData('projects');
            case 1: // Nodes
                return this.loadData('nodes');
            case 2: // Tags
                return this.loadData('tags');
            case 3: // Schemas
                return this.loadData('schemas');
            case 4: // Microschemas
                return this.loadData('microschemas');
            case 5: // Users
                return this.loadData('users');
            case 6: // Groups
                return this.loadData('groups');
            case 7: // Roles
                return this.loadData('roles');
        }
    }

    private loadData(entity: keyof TreeTableData) {}
}
