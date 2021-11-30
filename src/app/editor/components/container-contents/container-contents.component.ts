import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { DropdownList } from 'gentics-ui-core';
import { PaginationInstance } from 'ngx-pagination';
import { combineLatest, from, of, Observable, Subject } from 'rxjs';
import {
    combineAll,
    distinctUntilChanged,
    filter,
    map,
    startWith,
    switchMap,
    switchMapTo,
    takeUntil,
    tap,
    withLatestFrom
} from 'rxjs/operators';
import {
    QUERY_KEY_KEYWORD,
    QUERY_KEY_NODE_STATUS_FILTER,
    QUERY_KEY_PAGE,
    QUERY_KEY_PERPAGE,
    QUERY_KEY_TAGS
} from 'src/app/common/constants';
import { ConfigService } from 'src/app/core/providers/config/config.service';
import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';
import { PublishAllOptionsComponent } from 'src/app/shared/components/publish-all-options/publish-all-options.component';

import { SchemaReference, SearchQueryParameter } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { NodeListResponse } from '../../../common/models/server-models';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined, parseNodeStatusFilterString } from '../../../common/util/util';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ContainerFileDropAreaComponent } from '../container-file-drop-area/container-file-drop-area.component';

@Component({
    selector: 'mesh-container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerContentsComponent implements OnInit, OnDestroy {
    @ViewChild(ContainerFileDropAreaComponent, { static: true }) fileDropArea: ContainerFileDropAreaComponent;
    @ViewChild('nodeActionsDropdownList', { static: true }) nodeActionsDropdownList: DropdownList;
    @ViewChild('publishAllOptionsComponent', { static: true }) publishAllOptionsComponent: PublishAllOptionsComponent;

    /** @internal */
    schemas$: Observable<SchemaReference[]>;

    /** @internal */
    childrenBySchema$: Observable<{ [schemaUuid: string]: MeshNode[] }>;

    searching$: Observable<boolean>;

    /** Number of items on each paginated page */
    itemsPerPage: number;
    /** Current page of pagination */
    currentPage = 1;

    /** Current node status filter. Does not contain a status twice. */
    currentNodeStatusFilter: EMeshNodeStatusStrings[] = [];

    /** Current project name */
    projectName: string;
    /** Current container uuid */
    containerUuid: string;
    /** Current content language */
    currentLanguage: string;

    /** Initial config */
    paginationConfig: PaginationInstance = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage,
        totalItems: 0
    };

    nodeStatuses: EMeshNodeStatusStrings[] = Object.values(EMeshNodeStatusStrings);
    nodeStatusStringsEnum: typeof EMeshNodeStatusStrings = EMeshNodeStatusStrings;

    private destroy$ = new Subject<void>();

    constructor(
        private listEffects: ListEffectsService,
        private tagEffects: TagsEffectsService,
        private route: ActivatedRoute,
        private entities: EntitiesService,
        private state: ApplicationStateService,
        private router: Router,
        private config: ConfigService
    ) {}

    ngOnInit(): void {
        // set number of items displayed per page from config
        this.itemsPerPage = this.config.CONTENT_ITEMS_PER_PAGE;
        const onLogin$ = this.state.select(state => state.auth.loggedIn).pipe(filter(loggedIn => loggedIn));

        // set current parent node
        onLogin$
            .pipe(
                obs => this.switchMapToParams(obs),
                takeUntil(this.destroy$)
            )
            .subscribe(({ containerUuid, projectName, language }) => {
                this.projectName = projectName;
                this.containerUuid = containerUuid;
                this.currentLanguage = language;
                this.listEffects.setActiveContainer(projectName, containerUuid, language);
            });

        // get search filter from url parameters
        const searchParams$: Observable<SearchQueryParameter> = this.route.queryParamMap.pipe(
            map(this.extractQueryParams)
        );

        // request node children
        this.router.events
            .filter(ev => ev instanceof NavigationEnd)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const { keyword, tags, page, perPage } = this.extractQueryParams(this.route.snapshot.queryParamMap);
                const { containerUuid, projectName, language } = this.extractPathParams(this.route.snapshot.paramMap);
                this.projectName = projectName;
                this.containerUuid = containerUuid;
                this.currentLanguage = language;

                if (keyword === '' && tags === '') {
                    this.listEffects
                        .loadChildren(projectName, containerUuid, language, +page, +perPage)
                        .then((responseData: NodeListResponse) => {
                            this.updatePagination(responseData);
                        });
                } else {
                    const searchedTags = tags
                        .split(',')
                        .map(uuid => this.entities.getTag(uuid))
                        .filter(notNullOrUndefined);
                    this.listEffects.searchNodes(keyword, searchedTags, projectName, language);
                }
            });

        // load project-associated data
        this.state
            .select(state => state.list.currentProject)
            .pipe(
                filter(notNullOrUndefined),
                takeUntil(this.destroy$)
            )
            .subscribe(projectName => {
                this.listEffects.loadSchemasForProject(projectName).subscribe();
                this.listEffects.loadMicroschemasForProject(projectName);
                this.tagEffects.loadTagFamiliesAndTheirTags(projectName);
            });

        // node children by schema
        this.childrenBySchema$ = combineLatest(
            this.state.select(state => state.list.items),
            this.state.select(state => state.list.language)
        ).pipe(
            switchMap(([items, language]) =>
                from(items).pipe(
                    map(uuid => this.entities.selectNode(uuid, { language })),
                    combineAll(),
                    startWith([])
                )
            ),
            map(items => items.filter(notNullOrUndefined)),
            withLatestFrom(this.state.select(state => state.list.filterTerm)),
            map(([items, filterTerm]) => this.filterNodes(items, filterTerm)),
            map(this.groupNodesBySchema)
        );

        // get schemas
        this.schemas$ = this.childrenBySchema$.pipe(
            map(childrenBySchema =>
                Object.values(childrenBySchema)
                    .map(nodes => nodes[0])
                    .sort((a: MeshNode, b: MeshNode) => {
                        if (a.container === true && b.container === false) {
                            // Push containers to the top.
                            return -1;
                        } else if (a.container === false && b.container === true) {
                            // Push containers to the top.
                            return 1;
                        } else {
                            // If both nodes are containers or both are not - order by name.
                            return a.schema.name! > b.schema.name! ? 1 : -1;
                        }
                    })
                    .map(node => node.schema as SchemaReference)
            )
        );

        this.searching$ = searchParams$.pipe(
            tap(({ nodeStatusFilter }) => {
                this.currentNodeStatusFilter = parseNodeStatusFilterString(nodeStatusFilter);
            }),
            map(
                ({ keyword, tags }) =>
                    keyword !== '' || tags !== '' || this.currentNodeStatusFilter.length < this.nodeStatuses.length
            )
        );
    }

    updatePagination(loadChildrenResponse: NodeListResponse) {
        if (!loadChildrenResponse._metainfo) {
            return;
        }

        this.paginationConfig = {
            currentPage: loadChildrenResponse._metainfo.currentPage,
            itemsPerPage: loadChildrenResponse._metainfo.perPage,
            totalItems: loadChildrenResponse._metainfo.totalCount
        };
    }

    onFileUploadClicked() {
        this.fileDropArea.openModalDialog([]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPageChange(pageNumber: number): void {
        setQueryParams(this.router, this.route, { p: pageNumber });
    }

    displayPaginationControls(): boolean {
        if (!this.paginationConfig.totalItems) {
            return false;
        }
        return this.itemsPerPage <= this.paginationConfig.totalItems;
    }

    nodeActionsModalContentUpdated() {
        if (!!this.nodeActionsDropdownList) {
            this.nodeActionsDropdownList.resize();
        }
    }

    nodeActionsModalClicked() {
        if (!!this.publishAllOptionsComponent) {
            this.publishAllOptionsComponent.markPublishInformationForRefresh();
        }
    }

    private groupNodesBySchema(nodes: MeshNode[]): { [schemaUuid: string]: MeshNode[] } {
        const childrenBySchema: { [schemaUuid: string]: MeshNode[] } = {};

        for (const node of nodes || []) {
            if (!childrenBySchema[node.schema.uuid!]) {
                childrenBySchema[node.schema.uuid!] = [];
            }
            childrenBySchema[node.schema.uuid!].push(node);
        }
        return childrenBySchema;
    }

    /**
     * SwitchMaps the input observable to the router ParamMap related to the list route.
     */
    private switchMapToParams(
        input$: Observable<any>
    ): Observable<{ containerUuid: string; projectName: string; language: string }> {
        return input$.pipe(
            switchMapTo(this.route.paramMap),
            filter(params => params.has('containerUuid') && params.has('projectName') && params.has('language')),
            map(this.extractPathParams),
            distinctUntilChanged(
                (a, b) =>
                    a.containerUuid === b.containerUuid && a.projectName === b.projectName && a.language === b.language
            )
        );
    }

    private filterNodes(childNodes: MeshNode[], filterTerm: string): MeshNode[] {
        return childNodes.reduce((filteredNodes, node) => {
            const matchedNode = fuzzyMatch(filterTerm, node.displayName || '');
            return matchedNode ? [...filteredNodes, node] : filteredNodes;
        }, []);
    }

    private extractQueryParams(queryParamMap: ParamMap): SearchQueryParameter {
        // get search query
        const keyword = (queryParamMap.get(QUERY_KEY_KEYWORD) || '').trim();
        // get filter for tags
        const tags = (queryParamMap.get(QUERY_KEY_TAGS) || '').trim();
        // get node statuses
        const nodeStatusFilter = (queryParamMap.get(QUERY_KEY_NODE_STATUS_FILTER) || '').trim();
        // get current page
        const page = queryParamMap.get(QUERY_KEY_PAGE) || `${this.currentPage}`;
        // get max items per page
        const perPage = queryParamMap.get(QUERY_KEY_PERPAGE) || `${this.itemsPerPage}`;

        return { keyword, tags, nodeStatusFilter, page, perPage };
    }

    private extractPathParams(paramMap: ParamMap) {
        return {
            containerUuid: paramMap.get('containerUuid')!,
            projectName: paramMap.get('projectName')!,
            language: paramMap.get('language')!
        };
    }
}
