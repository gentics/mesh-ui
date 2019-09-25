import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { commonColumns, isNodePermission, simpleQuery } from '../permissions.util';

export type EntityType = 'projects' | 'schemas' | 'microschemas' | 'users' | 'groups' | 'roles';

interface GtxTreeNode extends TreeNode {
    data: MeshBasePerms;
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

type Permission = keyof MeshBasePerms['rolePerms'];

@Component({
    selector: 'mesh-simple-permissions',
    templateUrl: './simple-permissions.component.html',
    styleUrls: ['./simple-permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePermissionsComponent implements OnInit {
    @Input()
    role: AdminRoleResponse;

    @Input()
    entityType: EntityType;

    treeTableData: GtxTreeNode[] = [];

    columns = commonColumns;

    loading = false;

    canCreate = false;

    constructor(private api: ApiService, private change: ChangeDetectorRef) {}

    async ngOnInit() {
        this.loadData();
        this.initCanCreate();
    }

    public allChecked(val: MeshBasePerms) {
        return Object.values(val.rolePerms).every(x => x);
    }

    public async togglePermission(entity: MeshBasePerms, permission: Permission) {
        if (!isNodePermission(permission)) {
            return;
        }

        const permissions = entity.rolePerms;
        permissions[permission] = !permissions[permission];

        await this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    {
                        path: `${this.entityType}/${entity.uuid}`,
                        roleUuid: this.role.uuid
                    },
                    {
                        recursive: false,
                        permissions
                    }
                )
                .toPromise()
        );

        this.change.markForCheck();
    }

    public async setAllPermissions(entity: MeshBasePerms, value: boolean) {
        const permissions = {
            create: value,
            read: value,
            update: value,
            delete: value
        };

        await this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    {
                        path: `${this.entityType}/${entity.uuid}`,
                        roleUuid: this.role.uuid
                    },
                    {
                        recursive: false,
                        permissions
                    }
                )
                .toPromise()
        );

        entity.rolePerms = permissions;
        this.change.markForCheck();
    }

    private async initCanCreate() {
        const response = await this.api.admin
            .getRolePermissions({
                path: this.entityType,
                roleUuid: this.role.uuid
            })
            .toPromise();
        this.canCreate = response.create;
        this.change.markForCheck();
    }

    private async loadData() {
        const response = await this.fetchData();

        this.treeTableData = response.map((element: any) => ({
            data: element,
            children: []
        }));
        this.change.markForCheck();
    }

    private async fetchData() {
        // TODO set perPage param

        if (this.entityType === 'projects') {
            const response = await this.loadingPromise(
                this.api.project.getProjects({ role: this.role.uuid, fields: 'uuid,name,rolePerms' }).toPromise()
            );
            return response.data;
        } else {
            const response = await this.loadingPromise(
                this.api.graphQLInAnyProject({
                    query: simpleQuery(this.entityType),
                    variables: {
                        roleUuid: this.role.uuid
                    }
                })
            );
            return response.entity.elements;
        }
    }

    public async canCreateClicked(create: any) {
        this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    {
                        path: this.entityType,
                        roleUuid: this.role.uuid
                    },
                    {
                        recursive: false,
                        permissions: { create }
                    }
                )
                .toPromise()
        );
    }

    public async columnClicked(perm: Permission) {
        const value = !this.allCheckedColumn(perm);
        await this.loadingPromise(
            Promise.all(
                this.treeTableData
                    .filter(entity => entity.data.rolePerms[perm] !== value)
                    .map(entity =>
                        this.api.admin
                            .setRolePermissions(
                                {
                                    path: `${this.entityType}/${entity.data.uuid}`,
                                    roleUuid: this.role.uuid
                                },
                                {
                                    recursive: false,
                                    permissions: {
                                        [perm]: value
                                    }
                                }
                            )
                            .toPromise()
                    )
            )
        );
        this.treeTableData.forEach(entity => (entity.data.rolePerms[perm] = value));
        this.change.markForCheck();
    }

    public async columnAllClicked() {
        const value = !this.allCheckedAll();
        const permissions: MeshBasePerms['rolePerms'] = {
            create: value,
            read: value,
            update: value,
            delete: value
        };

        await this.loadingPromise(
            Promise.all(
                this.treeTableData
                    .filter(entity => !Object.values(entity.data.rolePerms).every(perm => perm === value))
                    .map(entity =>
                        this.api.admin
                            .setRolePermissions(
                                {
                                    path: `${this.entityType}/${entity.data.uuid}`,
                                    roleUuid: this.role.uuid
                                },
                                {
                                    recursive: false,
                                    permissions
                                }
                            )
                            .toPromise()
                    )
            )
        );
        this.treeTableData.forEach(entity => (entity.data.rolePerms = permissions));
        this.change.markForCheck();
    }

    public allCheckedColumn(permission: Permission) {
        return this.treeTableData.every(entity => entity.data.rolePerms[permission]);
    }

    public allCheckedAll() {
        return this.treeTableData.every(entity => this.allChecked(entity.data));
    }

    private loadingPromise<T extends PromiseLike<any>>(promise: T): T {
        this.loading = true;
        this.change.markForCheck();
        promise.then(
            () => {
                this.loading = false;
                this.change.markForCheck();
            },
            () => {
                this.loading = false;
                this.change.markForCheck();
            }
        );
        return promise;
    }
}
