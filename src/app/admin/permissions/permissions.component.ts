import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { nodes } from 'e2e/uuids';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../providers/effects/admin-role-effects.service';

import { commonColumns, simpleQuery } from './permissions.util';

interface GtxTreeNode<T> {
    data: T;
}

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
    uuid: string;
    name: string;
    rolePerms: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
}

interface MeshProjectPerms extends MeshBasePerms {
    canCreateNewTagFamilies: boolean;
}

interface MeshNodePerms extends MeshBasePerms {
    rolePerms: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
        publish: boolean;
        readPublish: boolean;
    };
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
export class PermissionsComponent implements OnInit {
    role: AdminRoleResponse;

    commonColumns = commonColumns;

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

    constructor(private api: ApiService, private change: ChangeDetectorRef, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe(data => (this.role = data.role));
    }

    checkboxAllClicked(event: any): void {}

    public loadEntities(index: number) {
        switch (index) {
            case 0: // Projects
                return this.loadData('projects');

            // Don't do anything for tags and nodes, this is handled by their own components
            // case 1: // Nodes
            // case 2: // Tags

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

    public allChecked(val: MeshBasePerms) {
        return Object.values(val.rolePerms).every(x => x);
    }

    public setPermission(
        entity: keyof TreeTableData,
        uuid: string,
        permission: keyof MeshBasePerms['rolePerms'],
        value: boolean
    ) {
        this.treeTableData[entity].find(element => element.data.uuid === uuid)!.data.rolePerms[permission] = value;
        this.change.markForCheck();

        this.api.admin
            .setRolePermissions(
                {
                    path: `${entity}/${uuid}`,
                    roleUuid: this.role.uuid
                },
                {
                    recursive: false,
                    permissions: {
                        [permission]: value
                    }
                }
            )
            .subscribe();
    }

    public setAllPermissions(entity: keyof TreeTableData, uuid: string, value: boolean) {
        const permissions = {
            create: value,
            read: value,
            update: value,
            delete: value,
            ...(entity === 'nodes'
                ? {
                      publish: value,
                      readPublish: value
                  }
                : {})
        };
        this.treeTableData[entity].find(element => element.data.uuid === uuid)!.data.rolePerms = permissions;
        this.change.markForCheck();

        this.api.admin
            .setRolePermissions(
                {
                    path: `${entity}/${uuid}`,
                    roleUuid: this.role.uuid
                },
                {
                    recursive: false,
                    permissions
                }
            )
            .subscribe();
    }

    private async loadData(entity: keyof TreeTableData) {
        const response = await this.fetchData(entity);

        this.treeTableData[entity] = response.map((element: any) => ({
            data: element,
            children: []
        }));
        this.change.markForCheck();
    }

    private async fetchData(entity: keyof TreeTableData) {
        // TODO set perPage param
        // TODO loading spinner

        if (entity === 'projects') {
            const response = await this.api.project
                .getProjects({ role: this.role.uuid, fields: 'uuid,name,rolePerms' })
                .toPromise();
            return response.data;
        } else {
            const response = await this.api.graphQLInAnyProject({
                query: simpleQuery(entity),
                variables: {
                    roleUuid: this.role.uuid
                }
            });
            return response.entity.elements;
        }
    }
}
