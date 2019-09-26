import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PermissionInfoFromServer, ProjectResponse } from 'src/app/common/models/server-models';
import { extractGraphQlResponse } from 'src/app/common/util/util';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { loadMoreDummy, AbstractPermissionsComponent, LoadMoreDummyNode } from '../abstract-permissions.component';
import { commonColumns, createColumns } from '../permissions.util';

interface NodeNode extends TreeNode {
    data: NodeData;
    children: GtxTreeNode[];
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
          children(perPage: 20, page: $page) {
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
    styleUrls: ['../permissions.common.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePermissionsComponent extends AbstractPermissionsComponent<NodeNode> implements OnInit {
    @Input()
    role: AdminRoleResponse;

    columns = [...commonColumns, ...createColumns(['publish', 'readPublished'])];

    constructor(api: ApiService, change: ChangeDetectorRef) {
        super(api, change);
    }

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
        this.setPermissionsRecursively(node, node.data.rolePerms);
        this.change.markForCheck();
    }

    private setPermissionsRecursively(node: NodeNode, permissions: PermissionInfoFromServer) {
        node.data.rolePerms = {
            ...node.data.rolePerms,
            ...permissions
        };
        node.children.filter(this.isRealNode).forEach(child => this.setPermissionsRecursively(child, permissions));
    }

    getPath(node: NodeNode): string {
        return `projects/${node.data.project.uuid}/nodes/${node.data.uuid}`;
    }
}
