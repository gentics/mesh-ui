import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ProjectResponse, TagFamilyResponse, TagResponse } from 'src/app/common/models/server-models';
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
    projectName: string;
}

interface TagNode {
    data: TagResponse & { type: 'tag' };
    children: never;
    leaf: true;
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
                projectName: project.name,
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
                    { project: tagFamily.projectName },
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
                ...tag
            },
            leaf: true
        }));
    }

    private loadingPromise<T extends PromiseLike<any>>(promise: T): T {
        this.loading = true;
        promise.then(() => (this.loading = false), () => (this.loading = false));
        return promise;
    }
}
