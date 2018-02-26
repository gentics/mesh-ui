import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

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

    listLanguage: string;

    private subscription: Subscription;
    /** @internal */
    public schemas: SchemaReference[] = [];
    /** @internal */
    public childrenBySchema: { [schemaUuid: string]: FilterSelection[] } = { };

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

        const languageSub = this.state.select(state => state.list.language)
            .subscribe(lang => this.listLanguage = lang);

        const routerParamsSub = onLogin$
            .let(obs => this.switchMapToParams(obs))
            .subscribe(({ containerUuid, projectName, language }) => {
                this.listEffects.setActiveContainer(projectName, containerUuid, language);
            });


        const childNodesSub = this.state.select(state => state.list.children)
            .subscribe(childrenUuid => this.updateChildList());

        const filterSub = this.state.select(state => state.list.filterTerm)
            .subscribe(filter => this.updateChildList());

        const searchSub = this.state.select(state => state.list.searchByKeywordResults)
            .subscribe(results => this.updateChildList());

        const searchByTagSub = this.state.select(state => state.list.searchByTagResults)
            .subscribe(results => this.updateChildList());

        const onProjectLoadSchemasSub = this.state
            .select(state => state.list.currentProject)
            .filter<string>(notNullOrUndefined)
            .subscribe(projectName => {
                this.listEffects.loadSchemasForProject(projectName);
                this.listEffects.loadMicroschemasForProject(projectName);
                this.tagEffects.loadTagFamiliesAndTheirTags(projectName);
            });

        this.subscription = routerParamsSub
            .add(languageSub)
            .add(childNodesSub)
            .add(onProjectLoadSchemasSub)
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

    // There are two types of search results: Search by keyword (list.searchByKeywordResults and list.searchByTagResults).
    // First we look at the searchByKeywordResults and if it's !== null we apply intersect it with the searchByTagResults
    // If The searchByKeywordResults === null and searchByTagResuls !== null - we return full searchByTagResults.
    // Otherwise we just return nodes of current selected parent node
    private getSearchResults (): MeshNode[] {
        let childNodesUuid;
        console.log('getting cildren');

        if (this.state.now.list.searchByKeywordResults !== null) {
            if (this.state.now.list.searchByTagResults !== null && this.state.now.list.searchByTagResults.length > 0) { //intersect with searchByTagResults
                childNodesUuid = this.state.now.list.searchByKeywordResults.filter(searchByKeywordUuid =>
                    this.state.now.list.searchByTagResults.some(searchByTagUuid =>
                        searchByKeywordUuid === searchByTagUuid));
            } else {
                childNodesUuid = this.state.now.list.searchByKeywordResults;
            }
        } else if (this.state.now.list.searchByTagResults != null && this.state.now.list.searchByTagResults.length > 0) {
            childNodesUuid = this.state.now.list.searchByTagResults;
        } else { // no searching is done at all
            childNodesUuid = this.state.now.list.children;
        }

        return childNodesUuid.map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }));
    }

    private updateChildList(): void {
        //const childNodes = this.state.now.list.children.map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }));
        /*const childNodes: MeshNode[] = this.state.now.list.searchResults !== null
            ? this.state.now.list.searchResults.map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }))
            : this.state.now.list.children.map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }));*/

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
