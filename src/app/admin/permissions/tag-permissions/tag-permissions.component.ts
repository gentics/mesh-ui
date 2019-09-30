import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import {
    PermissionInfoFromServer,
    ProjectResponse,
    TagFamilyResponse,
    TagResponse
} from 'src/app/common/models/server-models';
import { flatMap } from 'src/app/common/util/util';
import { ApiService } from 'src/app/core/providers/api/api.service';

import { AdminRoleResponse } from '../../providers/effects/admin-role-effects.service';
import { loadMoreDummy, AbstractPermissionsComponent, LoadMoreDummyNode } from '../abstract-permissions.component';
import { commonColumns, isBasePermission, simpleQuery, BasePermission, ChildrenResponse } from '../permissions.util';

interface ProjectNode extends TreeNode {
    data: ProjectData;
    children: Array<LoadMoreDummyNode | TagFamilyNode>;
    leaf: false;
}

interface ProjectData extends ProjectResponse {
    type: 'project';
    nextPage: number;
}

interface TagFamilyNode extends TreeNode {
    data: TagFamilyData;
    children: Array<LoadMoreDummyNode | TagNode>;
    leaf: false;
}

interface TagFamilyData extends TagFamilyResponse {
    type: 'tagFamily';
    nextPage: number;
    project: ProjectResponse;
}

interface TagNode extends TreeNode {
    data: TagData;
    children: never;
    leaf: true;
}

interface TagData extends TagResponse {
    type: 'tag';
    tagFamily: TagFamilyData;
}

type EditableNode = TagFamilyNode | TagNode;

type GtxTreeNode = ProjectNode | EditableNode;

@Component({
    selector: 'mesh-tag-permissions',
    templateUrl: './tag-permissions.component.html',
    styleUrls: ['../permissions.common.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagPermissionsComponent extends AbstractPermissionsComponent<GtxTreeNode> implements OnInit {
    @Input()
    role: AdminRoleResponse;

    commonColumns = commonColumns;

    constructor(api: ApiService, change: ChangeDetectorRef) {
        super(api, change);
    }

    async ngOnInit() {
        const response = await this.api.project.getProjects({ fields: 'uuid,name' }).toPromise();
        this.treeTableData = response.data.map(
            project =>
                ({
                    data: {
                        type: 'project',
                        nextPage: 1,
                        ...project
                    },
                    children: [],
                    leaf: false
                } as ProjectNode)
        );
        this.change.markForCheck();
    }

    public async loadData({ node }: { node: GtxTreeNode }) {
        const data = node.data;
        let response: ChildrenResponse<any>;
        if (data.type === 'project') {
            response = await this.loadTagFamilies(data);
        } else if (data.type === 'tagFamily') {
            response = await this.loadTags(data);
        } else {
            throw new Error('Cannot expand other types of nodes');
        }

        this.removeLoadMoreDummy(node.children);

        node.children = [...node.children, ...response.elements];

        if (response.hasNextPage) {
            (node.children as any).push(loadMoreDummy);
        }

        // This forces angular to push the new data to the component
        this.treeTableData = [...this.treeTableData];
        this.change.markForCheck();
    }

    private async loadTagFamilies(project: ProjectData): Promise<ChildrenResponse<TagFamilyNode>> {
        const response = await this.loadingPromise(
            this.api
                .graphQL(
                    { project: project.name },
                    {
                        query: simpleQuery('tagFamilies'),
                        variables: {
                            roleUuid: this.role.uuid,
                            page: project.nextPage++
                        }
                    }
                )
                .toPromise()
        );
        return {
            hasNextPage: response.data.entity.hasNextPage,
            elements: response.data.entity.elements.map((tagFamily: TagFamilyResponse) => ({
                data: {
                    type: 'tagFamily',
                    nextPage: 1,
                    project,
                    ...tagFamily
                },
                children: [],
                leaf: false
            }))
        };
    }

    private async loadTags(tagFamily: TagFamilyData): Promise<ChildrenResponse<TagFamilyNode>> {
        const response = await this.loadingPromise(
            this.api
                .graphQL(
                    { project: tagFamily.project.name },
                    {
                        query: `query loadTags($tagFamilyUuid: String, $roleUuid: String!, $page: Long) {
        tagFamily(uuid: $tagFamilyUuid) {
          tags(perPage: 20, page: $page) {
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
            hasNextPage
          }
        }
      }
      `,
                        variables: {
                            tagFamilyUuid: tagFamily.uuid,
                            roleUuid: this.role.uuid,
                            page: tagFamily.nextPage++
                        }
                    }
                )
                .toPromise()
        );
        return {
            hasNextPage: response.data.tagFamily.tags.hasNextPage,
            elements: response.data.tagFamily.tags.elements.map((tag: TagResponse) => ({
                data: {
                    type: 'tag',
                    tagFamily,
                    ...tag
                },
                leaf: true
            }))
        };
    }

    getPath(node: EditableNode): string {
        const element = node.data;
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

    protected getAllVisibleNodes(parent?: GtxTreeNode): EditableNode[] {
        if (!parent) {
            return flatMap(this.treeTableData.filter(this.isRealNode), item => this.getAllVisibleNodes(item));
        }

        const result: any[] = [];
        if (parent.data.type !== 'project') {
            result.push(parent);
        }

        if (parent.expanded) {
            result.push(
                ...flatMap((parent.children as any).filter(this.isRealNode) as any, (item: any) =>
                    this.getAllVisibleNodes(item)
                )
            );
        }
        return result;
    }
}
