import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { commonColumns, simpleQuery } from '../permissions.util';

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

    constructor(private api: ApiService, private change: ChangeDetectorRef) {}

    async ngOnInit() {
        this.loadData();
    }

    public allChecked(val: MeshBasePerms) {
        return Object.values(val.rolePerms).every(x => x);
    }

    public async setPermission(entity: MeshBasePerms, permission: keyof MeshBasePerms['rolePerms'], value: boolean) {
        await this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    {
                        path: `${this.entityType}/${entity.uuid}`,
                        roleUuid: this.role.uuid
                    },
                    {
                        recursive: false,
                        permissions: {
                            [permission]: value
                        }
                    }
                )
                .toPromise()
        );

        entity.rolePerms[permission] = value;
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
            const response = await this.api.project
                .getProjects({ role: this.role.uuid, fields: 'uuid,name,rolePerms' })
                .toPromise();
            return response.data;
        } else {
            const response = await this.api.graphQLInAnyProject({
                query: simpleQuery(this.entityType),
                variables: {
                    roleUuid: this.role.uuid
                }
            });
            return response.entity.elements;
        }
    }

    public canCreateClicked(event: any) {
        console.log(event);
    }

    private loadingPromise<T extends PromiseLike<any>>(promise: T): T {
        this.loading = true;
        promise.then(() => (this.loading = false), () => (this.loading = false));
        return promise;
    }
}
