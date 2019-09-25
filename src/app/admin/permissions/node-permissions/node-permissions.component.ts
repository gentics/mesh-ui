import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PermissionInfoFromServer, ProjectResponse } from 'src/app/common/models/server-models';
import { extractGraphQlResponse, flatMap } from 'src/app/common/util/util';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { commonColumns, createColumns } from '../permissions.util';

interface NodeNode extends TreeNode {
    data: NodeData;
    children: GtxTreeNode[];
}

interface LoadMoreDummyNode extends TreeNode {
    data: {
        type: 'loadmore';
    };
}

type GtxTreeNode = LoadMoreDummyNode | NodeNode;

interface NodeData {
    uuid: string;
    name: string;
    type: 'node';
    project: ProjectResponse;
    lastPageLoaded: number;
    rolePerms: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
        publish: boolean;
        readPublished: boolean;
    };
    children: {
        size: 0 | 1;
    };
}

interface ChildrenResponse {
    hasNextPage: boolean;
    elements: NodeData[];
}

const loadMoreDummy: LoadMoreDummyNode = {
    data: {
        type: 'loadmore'
    }
};

const nodePermsFragment = `
fragment NodePerms on Node {
  uuid
  name: displayName
  rolePerms(role: $roleUuid) {
    create
    read
    update
    delete
    publish
    readPublished
  }
  children(perPage: 1) {
    size
  }
}
`;

const childrenQuery = `
      query rootNode($parentUuid: String, $roleUuid: String!, $page: Long) {
        node(uuid: $parentUuid) {
          children(perPage: 3, page: $page) {
            elements {
              ...NodePerms
            }
            hasNextPage
          }
        }
      }
      ${nodePermsFragment}
      `;

@Component({
    selector: 'mesh-node-permissions',
    templateUrl: './node-permissions.component.html',
    styleUrls: ['./node-permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePermissionsComponent implements OnInit {
    @Input()
    role: AdminRoleResponse;

    treeTableData: NodeNode[] = [];

    columns = [...commonColumns, ...createColumns(['publish', 'readPublished'])];

    loading = false;

    constructor(private api: ApiService, private change: ChangeDetectorRef) {}

    async ngOnInit() {
        const response = await this.api.project.getProjects({ fields: 'uuid,name' }).toPromise();
        const rootNodes = await Promise.all(
            response.data.map(project =>
                this.fetchRootNode(project.name).then(node => ({
                    ...node,
                    name: project.name,
                    project,
                    recursive: false
                }))
            )
        );

        this.treeTableData = rootNodes.map(this.toNodeNode);

        this.change.markForCheck();
    }

    private async fetchRootNode(project: string): Promise<NodeData> {
        return this.loadingPromise(
            this.api
                .graphQL(
                    { project },
                    {
                        query: `query rootNode($roleUuid: String!) {
        rootNode {
          ...NodePerms
        }
      }
      ${nodePermsFragment}
      `,
                        variables: {
                            roleUuid: this.role.uuid
                        }
                    }
                )
                .map(extractGraphQlResponse)
                .toPromise()
                .then(response => {
                    response.rootNode.type = 'node';
                    return response.rootNode;
                })
        );
    }

    private toNodeNode(node: NodeData): NodeNode {
        return {
            data: node,
            // Size is 1 if the node contains at least one child.
            leaf: !node.children.size,
            children: []
        };
    }

    public async onNodeExpand({ node }: { node: NodeNode }) {
        const response = await this.fetchChildren(node.data);
        node.children = response.elements.map(this.toNodeNode);
        node.data.lastPageLoaded = 1;
        if (response.hasNextPage) {
            node.children.push(loadMoreDummy);
        }

        // This forces angular to push the new data to the component
        this.treeTableData = [...this.treeTableData];
        this.change.markForCheck();
    }

    private async fetchChildren(node: NodeData, page?: number): Promise<ChildrenResponse> {
        return this.loadingPromise(
            this.api
                .graphQL(
                    { project: node.project.name },
                    {
                        query: childrenQuery,
                        variables: {
                            roleUuid: this.role.uuid,
                            parentUuid: node.uuid,
                            page: page || 1
                        }
                    }
                )
                .map(extractGraphQlResponse)
                .toPromise()
                .then(response => ({
                    hasNextPage: response.node.children.hasNextPage,
                    elements: response.node.children.elements.map((child: NodeData) => ({
                        ...child,
                        project: node.project,
                        recursive: false,
                        type: 'node'
                    }))
                }))
        );
    }

    public async setPermission(
        { node }: { node: NodeNode },
        permission: keyof PermissionInfoFromServer,
        value: boolean
    ) {
        const permissions = {
            [permission]: value
        };

        await this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    { path: this.getPath(node), roleUuid: this.role.uuid },
                    {
                        recursive: false,
                        permissions: {
                            [permission]: value
                        }
                    }
                )
                .toPromise()
        );
        this.setPermissions(node, permissions as any, false);
        this.change.markForCheck();
    }

    public async setAllPermissions({ node }: { node: NodeNode }, value: boolean) {
        const permissions = {
            create: value,
            read: value,
            update: value,
            delete: value,
            publish: value,
            readPublished: value
        };
        await this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    { path: this.getPath(node), roleUuid: this.role.uuid },
                    {
                        recursive: false,
                        permissions
                    }
                )
                .toPromise()
        );

        this.setPermissions(node, permissions, false);
        this.change.markForCheck();
    }

    private setPermissions(node: NodeNode, permissions: PermissionInfoFromServer, recursive: boolean) {
        node.data.rolePerms = {
            ...node.data.rolePerms,
            ...permissions
        };
        if (recursive) {
            node.children.filter(this.isRealNode).forEach(child => this.setPermissions(child, permissions, recursive));
        }
    }

    public async loadMore(node: NodeNode) {
        const response = await this.fetchChildren(node.data, node.data.lastPageLoaded + 1);
        node.children.pop();
        node.children.push(...response.elements.map(this.toNodeNode));
        node.data.lastPageLoaded++;
        if (response.hasNextPage) {
            node.children.push(loadMoreDummy);
        }

        // This forces angular to push the new data to the component
        this.treeTableData = [...this.treeTableData];
        this.change.markForCheck();
    }

    private isRealNode(node: GtxTreeNode): node is NodeNode {
        return node.data.type === 'node';
    }

    public async columnClicked(perm: keyof PermissionInfoFromServer, value: boolean) {
        const elements = this.getAllVisibleNodes();

        await this.loadingPromise(
            Promise.all(
                elements
                    .filter(entity => entity.data.rolePerms[perm] !== value)
                    .map(entity =>
                        this.api.admin
                            .setRolePermissions(
                                {
                                    path: this.getPath(entity),
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
        elements.forEach(entity => (entity.data.rolePerms[perm] = value));
        this.change.markForCheck();
    }

    public async columnAllClicked(value: boolean) {
        const permissions = {
            create: value,
            read: value,
            update: value,
            delete: value,
            publish: value,
            readPublished: value
        };

        const elements = this.getAllVisibleNodes();

        await this.loadingPromise(
            Promise.all(
                elements
                    .filter(entity => !Object.values(entity.data.rolePerms).every(perm => perm === value))
                    .map(entity =>
                        this.api.admin
                            .setRolePermissions(
                                {
                                    path: this.getPath(entity),
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
        elements.forEach(entity => (entity.data.rolePerms = permissions as any));
        this.change.markForCheck();
    }

    public allCheckedColumn(permission: keyof PermissionInfoFromServer) {
        return this.getAllVisibleNodes().every(entity => entity.data.rolePerms[permission]);
    }

    public allCheckedAll() {
        return this.getAllVisibleNodes().every(entity => this.allChecked(entity.data));
    }

    public async applyRecursively({ node }: { node: NodeNode }) {
        await this.loadingPromise(
            this.api.admin
                .setRolePermissions(
                    { path: this.getPath(node), roleUuid: this.role.uuid },
                    {
                        recursive: true,
                        permissions: node.data.rolePerms
                    }
                )
                .toPromise()
        );
        this.setPermissions(node, node.data.rolePerms, true);
        this.change.markForCheck();
    }

    private getAllVisibleNodes(parent?: NodeNode): NodeNode[] {
        if (!parent) {
            return flatMap(this.treeTableData, item => this.getAllVisibleNodes(item));
        }
        if (!parent.expanded) {
            return [parent];
        } else {
            return [parent, ...flatMap(parent.children.filter(this.isRealNode), item => this.getAllVisibleNodes(item))];
        }
    }

    public allChecked(val: any) {
        return Object.values(val.rolePerms).every(x => !!x);
    }

    private getPath(node: NodeNode): string {
        return `projects/${node.data.project.uuid}/nodes/${node.data.uuid}`;
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
