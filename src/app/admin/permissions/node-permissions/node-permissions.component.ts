import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PermissionInfoFromServer, ProjectResponse } from 'src/app/common/models/server-models';
import { extractGraphQlResponse, flatMap } from 'src/app/common/util/util';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { commonColumns, createColumns } from '../permissions.util';

interface NodeNode extends TreeNode {
    data: NodeData;
    children: NodeNode[];
}

interface NodeData {
    uuid: string;
    name: string;
    project: ProjectResponse;
    recursive: boolean;
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
                .then(response => response.rootNode)
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
        const children = await this.fetchChildren(node.data);
        node.children = children.map(this.toNodeNode);

        // This forces angular to push the new data to the component
        this.treeTableData = [...this.treeTableData];
        this.change.markForCheck();
    }

    private async fetchChildren(node: NodeData): Promise<NodeData[]> {
        return this.loadingPromise(
            this.api
                .graphQL(
                    { project: node.project.name },
                    {
                        query: `
      query rootNode($parentUuid: String, $roleUuid: String!) {
        node(uuid: $parentUuid) {
          children(perPage: 20) {
            elements {
              ...NodePerms
            }
          }
        }
      }
      ${nodePermsFragment}
      `,
                        variables: {
                            roleUuid: this.role.uuid,
                            parentUuid: node.uuid
                        }
                    }
                )
                .map(extractGraphQlResponse)
                .toPromise()
                .then(response =>
                    response.node.children.elements.map((child: NodeData) => ({
                        ...child,
                        project: node.project,
                        recursive: false
                    }))
                )
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
                    { path: `projects/${node.data.project.uuid}/nodes/${node.data.uuid}`, roleUuid: this.role.uuid },
                    {
                        recursive: node.data.recursive,
                        permissions: {
                            [permission]: value
                        }
                    }
                )
                .toPromise()
        );
        this.setPermissions(node, permissions as any, node.data.recursive);
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
                    { path: `projects/${node.data.project.uuid}/nodes/${node.data.uuid}`, roleUuid: this.role.uuid },
                    {
                        recursive: node.data.recursive,
                        permissions
                    }
                )
                .toPromise()
        );

        this.setPermissions(node, permissions, node.data.recursive);
        this.change.markForCheck();
    }

    private setPermissions(node: NodeNode, permissions: PermissionInfoFromServer, recursive: boolean) {
        node.data.rolePerms = {
            ...node.data.rolePerms,
            ...permissions
        };
        if (recursive) {
            node.children.forEach(child => this.setPermissions(child, permissions, recursive));
        }
    }

    public setAllRecursive(value: boolean) {
        this.getAllVisibleNodes().forEach(node => (node.data.recursive = value));
        this.change.markForCheck();
    }

    public isAllRecursive(): boolean {
        return this.getAllVisibleNodes().every(node => node.data.recursive);
    }

    private getAllVisibleNodes(parent?: NodeNode): NodeNode[] {
        if (!parent) {
            return flatMap(this.treeTableData, item => this.getAllVisibleNodes(item));
        }
        if (!parent.expanded) {
            return [parent];
        } else {
            return [parent, ...flatMap(parent.children, item => this.getAllVisibleNodes(item))];
        }
    }

    public allChecked(val: any) {
        return Object.values(val.rolePerms).every(x => !!x);
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
