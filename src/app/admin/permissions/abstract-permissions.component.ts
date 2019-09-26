import { ChangeDetectorRef, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { flatMap, toObject } from 'src/app/common/util/util';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../providers/effects/admin-role-effects.service';

import {
    isNodePermission,
    nodePermissions,
    BasePermission,
    BasePermissions,
    NodePermission,
    NodePermissions
} from './permissions.util';

interface GtxTreeNode extends TreeNode {
    data: {
        type?: string;
        rolePerms: NodePermissions;
    };
    children: ChildNode[];
}

export interface LoadMoreDummyNode extends TreeNode {
    data: {
        type: 'loadmore';
    };
}

export const loadMoreDummy: LoadMoreDummyNode = {
    data: {
        type: 'loadmore'
    }
};

type ChildNode = GtxTreeNode | LoadMoreDummyNode;

export abstract class AbstractPermissionsComponent<N extends GtxTreeNode> {
    @Input()
    role: AdminRoleResponse;

    treeTableData: N[] = [];

    public loading = false;

    constructor(protected api: ApiService, protected change: ChangeDetectorRef) {}

    protected loadingPromise<T extends PromiseLike<any>>(promise: T): T {
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

    public async togglePermission({ node }: { node: N }, permission: string) {
        if (!isNodePermission(permission)) {
            return;
        }
        const entity = node.data;

        const permissions = entity.rolePerms;
        permissions[permission] = !permissions[permission];

        await this.setPermissions(this.getPath(node), permissions);

        this.change.markForCheck();
    }

    public async toggleAllPermissions({ node }: { node: N }) {
        const permissions = node.data.rolePerms;
        const value = !this.allChecked(node.data);

        await this.setPermissions(this.getPath(node), permissions);

        Object.keys(permissions).forEach((perm: NodePermission) => (permissions[perm] = value));

        this.change.markForCheck();
    }

    public async columnClicked(perm: NodePermission) {
        const value = !this.allCheckedColumn(perm);
        const nodes = this.getAllVisibleNodes();
        await this.loadingPromise(
            Promise.all(
                nodes
                    .filter(entity => entity.data.rolePerms[perm] !== value)
                    .map(entity => this.setPermissions(this.getPath(entity), { [perm]: value }))
            )
        );
        nodes.forEach(entity => (entity.data.rolePerms[perm] = value));
        this.change.markForCheck();
    }

    public async columnAllClicked() {
        const value = !this.allCheckedAll();
        const permissions: NodePermissions = toObject(k => k, () => value, nodePermissions) as NodePermissions;
        const nodes = this.getAllVisibleNodes();

        await this.loadingPromise(
            Promise.all(
                nodes
                    .filter(entity => !Object.values(entity.data.rolePerms).every(perm => perm === value))
                    .map(entity => this.setPermissions(this.getPath(entity), permissions))
            )
        );
        nodes.forEach(entity => (entity.data.rolePerms = { ...permissions }));
        this.change.markForCheck();
    }

    private setPermissions(path: string, permissions: Partial<NodePermissions>) {
        return this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    {
                        path: path,
                        roleUuid: this.role.uuid
                    },
                    {
                        recursive: false,
                        permissions
                    }
                )
                .toPromise()
        );
    }

    public allChecked(val: { rolePerms: BasePermission | NodePermissions }) {
        return Object.values(val.rolePerms).every(x => !!x);
    }

    public allCheckedColumn(permission: NodePermission) {
        return this.getAllVisibleNodes().every(entity => entity.data.rolePerms[permission]);
    }

    public allCheckedAll() {
        return this.getAllVisibleNodes().every(entity => this.allChecked(entity.data));
    }

    protected getAllVisibleNodes(parent?: N): N[] {
        if (!parent) {
            return flatMap(this.treeTableData, item => this.getAllVisibleNodes(item));
        }
        if (!parent.expanded) {
            return [parent];
        } else {
            return [
                parent,
                ...flatMap(parent.children.filter(this.isRealNode) as N[], item => this.getAllVisibleNodes(item))
            ];
        }
    }

    protected isRealNode(node: N): node is Exclude<N, LoadMoreDummyNode> {
        return node.data.type !== 'loadmore';
    }

    abstract getPath(elem: N): string;
}
