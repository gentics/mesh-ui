import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import {
    PermissionInfoFromServer,
    ProjectResponse,
    TagFamilyResponse,
    TagResponse
} from 'src/app/common/models/server-models';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { commonColumns, simpleQuery } from '../permissions.util';

interface ProjectNode extends TreeNode {
    data: ProjectResponse & { type: 'project' };
    children: TagFamilyNode[];
    leaf: false;
}

interface TagFamilyNode extends TreeNode {
    data: TagFamilyData & { type: 'tagFamily' };
    children: TagNode[];
    leaf: false;
}

interface TagFamilyData extends TagFamilyResponse {
    type: 'tagFamily';
    project: ProjectResponse;
}

interface TagNode {
    data: TagData;
    children: never;
    leaf: true;
}

interface TagData extends TagResponse {
    type: 'tag';
    tagFamily: TagFamilyData;
}

type GtxTreeNode = ProjectNode | TagFamilyNode | TagNode;

@Component({
    selector: 'mesh-tag-permissions',
    templateUrl: './tag-permissions.component.html',
    styleUrls: ['./tag-permissions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagPermissionsComponent implements OnInit {
    @Input()
    role: AdminRoleResponse;

    treeTableData: ProjectNode[] = [];

    commonColumns = commonColumns;

    loading = false;

    constructor(private api: ApiService, private change: ChangeDetectorRef) {}

    async ngOnInit() {
        const response = await this.api.project.getProjects({ fields: 'uuid,name' }).toPromise();
        this.treeTableData = response.data.map(project => ({
            data: {
                type: 'project',
                ...project
            },
            children: [],
            leaf: false
        }));
        this.change.markForCheck();
    }

    public async onNodeExpand({ node }: { node: GtxTreeNode }) {
        const data = node.data;
        if (data.type === 'project') {
            node.children = await this.loadTagFamilies(data);
        } else if (data.type === 'tagFamily') {
            node.children = await this.loadTags(data);
        }

        // This forces angular to push the new data to the component
        this.treeTableData = [...this.treeTableData];
        this.change.markForCheck();
    }

    private async loadTagFamilies(project: ProjectResponse): Promise<TagFamilyNode[]> {
        const response = await this.loadingPromise(
            this.api
                .graphQL(
                    { project: project.name },
                    {
                        query: simpleQuery('tagFamilies'),
                        variables: {
                            roleUuid: this.role.uuid
                        }
                    }
                )
                .toPromise()
        );
        return response.data.entity.elements.map((tagFamily: TagFamilyResponse) => ({
            data: {
                type: 'tagFamily',
                project,
                ...tagFamily
            },
            children: [],
            leaf: false
        }));
    }

    private async loadTags(tagFamily: TagFamilyData): Promise<TagFamilyNode[]> {
        const response = await this.loadingPromise(
            this.api
                .graphQL(
                    { project: tagFamily.project.name },
                    {
                        query: `query loadTags($tagFamilyUuid: String, $roleUuid: String!) {
        tagFamily(uuid: $tagFamilyUuid) {
          tags {
            elements {
              uuid
              name
              rolePerms(role: $roleUuid) {
                create
                read
                update
                delete
              }
            }
          }
        }
      }
      `,
                        variables: {
                            tagFamilyUuid: tagFamily.uuid,
                            roleUuid: this.role.uuid
                        }
                    }
                )
                .toPromise()
        );
        return response.data.tagFamily.tags.elements.map((tag: TagResponse) => ({
            data: {
                type: 'tag',
                tagFamily,
                ...tag
            },
            leaf: true
        }));
    }

    public async setPermission(
        element: TagFamilyData | TagData,
        permission: keyof PermissionInfoFromServer,
        value: boolean
    ) {
        this.api.admin
            .setRolePermissions(
                { path: this.getPath(element), roleUuid: this.role.uuid },
                {
                    recursive: false,
                    permissions: {
                        [permission]: value
                    }
                }
            )
            .subscribe();
        element.rolePerms[permission] = value;
        this.change.markForCheck();
    }

    public async setAllPermissions(element: TagFamilyData | TagData, value: boolean) {
        const permissions = {
            create: value,
            read: value,
            update: value,
            delete: value
        };
        this.api.admin
            .setRolePermissions(
                { path: this.getPath(element), roleUuid: this.role.uuid },
                {
                    recursive: false,
                    permissions
                }
            )
            .subscribe();
        element.rolePerms = permissions as any;
        this.change.markForCheck();
    }

    private getPath(element: TagFamilyData | TagData): string {
        if (element.type === 'tag') {
            return `projects/${element.tagFamily.project.uuid}/tagFamilies/${element.tagFamily.uuid}/tags/${
                element.uuid
            }`;
        } else if (element.type === 'tagFamily') {
            return `projects/${element.project.uuid}/tagFamilies/${element.uuid}`;
        } else {
            throw new Error('Unknown element');
        }
    }

    private loadingPromise<T extends PromiseLike<any>>(promise: T): T {
        this.loading = true;
        promise.then(() => (this.loading = false), () => (this.loading = false));
        return promise;
    }

    public allChecked(val: any) {
        return Object.values(val.rolePerms).every(x => x);
    }
}
