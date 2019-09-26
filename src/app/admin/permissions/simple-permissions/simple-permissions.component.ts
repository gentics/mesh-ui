import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AbstractPermissionsComponent } from '../abstract-permissions.component';
import { commonColumns, simpleQuery, NodePermissions } from '../permissions.util';

export type EntityType = 'projects' | 'schemas' | 'microschemas' | 'users' | 'groups' | 'roles';

interface GtxTreeNode extends TreeNode {
    data: MeshBasePerms;
    children: [];
}

interface MeshBasePerms {
    uuid: string;
    name: string;
    rolePerms: NodePermissions;
}

@Component({
    selector: 'mesh-simple-permissions',
    templateUrl: './simple-permissions.component.html',
    styleUrls: ['./simple-permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePermissionsComponent extends AbstractPermissionsComponent<GtxTreeNode> implements OnInit {
    @Input()
    entityType: EntityType;

    columns = commonColumns;

    canCreate = false;

    constructor(api: ApiService, change: ChangeDetectorRef) {
        super(api, change);
    }

    async ngOnInit() {
        this.loadData();
        this.initCanCreate();
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

    getPath(node: GtxTreeNode) {
        return `${this.entityType}/${node.data.uuid}`;
    }
}
