import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    withLatestFrom
} from 'rxjs/operators';

import { SchemaReference } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { NodeListResponse } from '../../../common/models/server-models';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
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

    /** @internal */
    schemas$: Observable<SchemaReference[]>;

    /** @internal */
    childrenBySchema$: Observable<{ [schemaUuid: string]: MeshNode[] }>;

    searching$: Observable<boolean>;

    /** Number of items on each paginated page */
    itemsPerPage = 8;
    /** Current page of pagination */
    currentPage = 1;

    /** Initial config */
    paginationConfig: PaginationInstance = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage,
        totalItems: 0
    };

    private destroy$ = new Subject<void>();

    constructor(
        private listEffects: ListEffectsService,
        private tagEffects: TagsEffectsService,
        private route: ActivatedRoute,
        private entities: EntitiesService,
        private state: ApplicationStateService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const onLogin$ = this.state.select(state => state.auth.loggedIn).pipe(filter(loggedIn => loggedIn));

        // set current parent node
        onLogin$
            .pipe(
                obs => this.switchMapToParams(obs),
                takeUntil(this.destroy$)
            )
            .subscribe(({ containerUuid, projectName, language }) => {
                this.listEffects.setActiveContainer(projectName, containerUuid, language);
            });

        // get list details from url parameters
        const listParams$ = of([]).pipe(obs => this.switchMapToParams(obs));

        // get search filter from url parameters
        const searchParams$ = this.route.queryParamMap.pipe(
            map(paramMap => {
                // get search query
                const keyword = (paramMap.get('q') || '').trim();
                // get filter for tags
                const tags = (paramMap.get('t') || '').trim();
                // get current page
                const page = paramMap.get('p') || this.currentPage;
                // get max items per page
                const perPage = paramMap.get('perPage') || this.itemsPerPage;

                return { keyword, tags, page, perPage };
            })
        );

        // request node children
        combineLatest(searchParams$, listParams$, this.state.select(state => state.entities.tag))
            .pipe(takeUntil(this.destroy$))
            .subscribe(([{ keyword, tags, page, perPage }, { containerUuid, projectName, language }]) => {
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
                this.listEffects.loadSchemasForProject(projectName);
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

        this.searching$ = searchParams$.pipe(map(({ keyword, tags }) => keyword !== '' || tags !== ''));
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

    private groupNodesBySchema(nodes: MeshNode[]): { [schemaUuid: string]: MeshNode[] } {
        nodes.sort((a: MeshNode, b: MeshNode) => {
            return (a.displayName || '') > (b.displayName || '') ? 1 : -1;
        });

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
            map(paramMap => ({
                // https://github.com/Microsoft/TypeScript/issues/9619
                containerUuid: paramMap.get('containerUuid')!,
                projectName: paramMap.get('projectName')!,
                language: paramMap.get('language')!
            })),
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
}
