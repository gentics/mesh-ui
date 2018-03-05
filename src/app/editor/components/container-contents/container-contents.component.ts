import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { SchemaReference, FilterSelection } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { notNullOrUndefined } from '../../../common/util/util';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { fuzzyMatch, fuzzyReplace } from '../../../common/util/fuzzy-search';

@Component({
    selector: 'container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerContentsComponent implements OnInit, OnDestroy {

    private subscription: Subscription =  new Subscription();
    /** @internal */
    public schemas: SchemaReference[] = [];
    /** @internal */
    public childrenBySchema: { [schemaUuid: string]: FilterSelection[] } = { };

    // Results in uuid of the search keyword.
    private searchedNodes: string[] = null;

    // Results in uuid of the search tags.
    private searchedTags: string[] = null;

    public listLanguage: string;
    public displayingSearchResults = false; // Template wants to know if it should show the [create node] button or not.

    constructor(private changeDetector: ChangeDetectorRef,
                private listEffects: ListEffectsService,
                private tagEffects: TagsEffectsService,
                private navigationService: NavigationService,
                private route: ActivatedRoute,
                private entities: EntitiesService,
                private state: ApplicationStateService) {
    }

    ngOnInit(): void {

        const onLogin$ = this.state.select(state => state.auth.loggedIn)
            .filter(loggedIn => loggedIn);

        this.subscription.add(this.state.select(state => state.list.language)
                                .subscribe(lang => this.listLanguage = lang));

        this.subscription.add(onLogin$.let(obs => this.switchMapToParams(obs))
                                .subscribe(({ containerUuid, projectName, language }) => {
                                    this.listEffects.setActiveContainer(projectName, containerUuid, language);
                                }));

        this.subscription.add(combineLatest(this.route.queryParamMap, this.state.select(state => state.entities.tag))
            .subscribe(([paramMap, tagUuids]) => {

                const searchKeyword = (paramMap.get('q') || '').trim();
                if (searchKeyword === '') {
                    this.searchedNodes = null;
                    this.updateChildList();
                } else {
                    this.listEffects.searchNodesByKeyword(
                        searchKeyword,
                        this.state.now.list.currentProject,
                        this.state.now.ui.currentLanguage)
                        .then(nodes => {
                            this.searchedNodes = nodes ? nodes.map(node => node.uuid) : null;
                            this.updateChildList();
                        });
                }

                if ((paramMap.get('t') || '').trim() === '') {
                    if (this.searchedTags !== null) { // We had a search for tags before and now we don't so lets refresh
                        this.searchedTags = null;
                        this.updateChildList();
                    }
                } else {
                    const searchedTags = paramMap.get('t')
                                            .split(',')
                                            .map(uuid => this.entities.getTag(uuid))
                                            .filter(tag => !!tag);

                    this.listEffects.searchNodesByTags(
                        searchedTags,
                        this.state.now.list.currentProject,
                        this.state.now.ui.currentLanguage)
                        .then(nodes => {
                            this.searchedTags = nodes ? nodes.map(node => node.uuid) : null;
                            this.updateChildList();
                        });
                }
            })
        );

        this.subscription.add(this.state.select(state => state.list.children)
                                .subscribe(childrenUuid => this.updateChildList()));

        this.subscription.add(this.state.select(state => state.list.filterTerm)
                                .subscribe(filter => this.updateChildList()));

        this.subscription.add(this.state
                                .select(state => state.list.currentProject)
                                .filter<string>(notNullOrUndefined)
                                .subscribe(projectName => {
                                    this.listEffects.loadSchemasForProject(projectName);
                                    this.listEffects.loadMicroschemasForProject(projectName);
                                    this.tagEffects.loadTagFamiliesAndTheirTags(projectName);
                                }));
    }


    /**
     * SwitchMaps the input observable to the router ParamMap related to the list route.
     */
    private switchMapToParams(input$: Observable<any>): Observable<{ containerUuid: string; projectName: string; language: string; }> {
        return input$
            .switchMapTo(this.route.paramMap)
            .filter(params =>
                params.has('containerUuid') &&
                params.has('projectName') &&
                params.has('language')
            )
            .map(paramMap => ({
                containerUuid: paramMap.get('containerUuid'),
                projectName: paramMap.get('projectName'),
                language: paramMap.get('language')
            }))
            .distinctUntilChanged((a, b) =>
                a.containerUuid === b.containerUuid &&
                a.projectName === b.projectName &&
                a.language === b.language
            );
    }

    private filterNodes = (childNodes: MeshNode[]) => {
        const filteredNodes = childNodes.reduce<FilterSelection[]>((filteredNodes, node) => {
            const matchedNode = fuzzyReplace(this.state.now.list.filterTerm, node.displayName);
            if (matchedNode) {
                matchedNode.extra = node;
                return [...filteredNodes, matchedNode];
            }
            return filteredNodes;
        }, []);

        return filteredNodes;
    }

    /**
     * There are two types of search results: Search by keyword (list.searchByKeywordResults and list.searchByTagResults).
     * First we look at the searchByKeywordResults and if it's !== null we apply intersect it with the searchByTagResults
     * If The searchByKeywordResults === null and searchByTagResuls !== null - we return full searchByTagResults.
     * Otherwise we just return nodes of current selected parent node.
    */
    private getSearchResults (): MeshNode[] {
        let childNodesUuid: string[] = [];

        if (this.searchedNodes !== null) {
            this.displayingSearchResults = true;
            if (this.searchedTags !== null) { // Intersect with searchByTagResults.
                childNodesUuid = this.searchedNodes.filter(searchByKeywordUuid =>
                    this.searchedTags.some(searchByTagUuid =>
                        searchByKeywordUuid === searchByTagUuid));
            } else {
                childNodesUuid = this.searchedNodes;
            }
        } else if (this.searchedTags !== null) {
            this.displayingSearchResults = true;
            childNodesUuid = this.searchedTags;
        } else { // No searching is done at all.
            this.displayingSearchResults = false;
            childNodesUuid = this.state.now.list.children;
        }

        return childNodesUuid.map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }));
    }

    private updateChildList(): void {
        const childNodes: MeshNode[] = this.getSearchResults();

        const schemas: SchemaReference[] = [];
        const childrenBySchema: { [schemaUuid: string]: FilterSelection[] } = {};

        const filteredNodes = this.filterNodes(childNodes);

        for (const filteredNode of filteredNodes || []) {
            const node = (filteredNode as FilterSelection).extra as MeshNode;
            if (!schemas.some(schema => node.schema.uuid === schema.uuid)) {
                schemas.push(node.schema);
                childrenBySchema[node.schema.uuid] = [];
            }
            childrenBySchema[node.schema.uuid].push(filteredNode);
        }

        this.schemas = schemas;
        this.childrenBySchema = childrenBySchema;
        this.changeDetector.markForCheck();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
