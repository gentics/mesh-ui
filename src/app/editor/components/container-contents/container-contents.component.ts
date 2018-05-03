import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { SchemaReference } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { notNullOrUndefined } from '../../../common/util/util';
import { EntitiesService } from '../../../state/providers/entities.service';
import { TagsEffectsService } from '../../../core/providers/effects/tags-effects.service';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { ContainerFileDropAreaComponent } from '../container-file-drop-area/container-file-drop-area.component';
import { SchemaReferenceFromServer } from '../../../common/models/server-models';

@Component({
    selector: 'container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerContentsComponent implements OnInit, OnDestroy {

    @ViewChild(ContainerFileDropAreaComponent) fileDropArea: ContainerFileDropAreaComponent

    /** @internal */
    public schemas$: Observable<SchemaReference[]>;
    /** @internal */
    public childrenBySchema$: Observable<{ [schemaUuid: string]: MeshNode[]; }>;

    public searching$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    constructor(private listEffects: ListEffectsService,
                private tagEffects: TagsEffectsService,
                private route: ActivatedRoute,
                private entities: EntitiesService,
                private state: ApplicationStateService) {
    }

    ngOnInit(): void {
        const onLogin$ = this.state.select(state => state.auth.loggedIn)
            .filter(loggedIn => loggedIn);

        onLogin$.let(obs => this.switchMapToParams(obs))
            .takeUntil(this.destroy$)
            .subscribe(({ containerUuid, projectName, language }) => {
                this.listEffects.setActiveContainer(projectName, containerUuid, language);
            });

        const listParams$ = Observable.of([]).let(obs => this.switchMapToParams(obs));
        const searchParams$ = this.route.queryParamMap
            .map(paramMap => {
                const keyword = (paramMap.get('q') || '').trim();
                const tags = (paramMap.get('t') || '').trim();
                return { keyword, tags };
            });

        combineLatest(
            searchParams$,
            listParams$,
            this.state.select(state => state.entities.tag)
        )
            .takeUntil(this.destroy$)
            .subscribe(([{ keyword, tags }, {containerUuid, projectName, language}]) => {
                if (keyword === '' && tags === '') {
                    this.listEffects.loadChildren(projectName, containerUuid, language);
                } else {
                    const searchedTags = tags
                        .split(',')
                        .map(uuid => this.entities.getTag(uuid))
                        .filter(tag => !!tag);
                    this.listEffects.searchNodes(keyword, searchedTags, projectName, language);
                }
            });

        this.state
            .select(state => state.list.currentProject)
            .filter<string>(notNullOrUndefined)
            .takeUntil(this.destroy$)
            .subscribe(projectName => {
                this.listEffects.loadSchemasForProject(projectName);
                this.listEffects.loadMicroschemasForProject(projectName);
                this.tagEffects.loadTagFamiliesAndTheirTags(projectName);
            });

        this.childrenBySchema$ = combineLatest(
            this.state.select(state => state.list.items),
            this.state.select(state => state.ui.currentLanguage)
        )
            .map(([items, language]) => items.map(uuid => this.entities.getNode(uuid, { language })))
            .combineLatest(this.state.select(state => state.list.filterTerm))
            .map(([items, filterTerm]) => this.filterNodes(items, filterTerm))
            .map(this.groupNodesBySchema);

        this.schemas$ = this.childrenBySchema$
            .map(childrenBySchema =>
                Object.values(childrenBySchema)
                    .map(nodes => nodes[0])
                    .sort((a: MeshNode, b: MeshNode) => {
                        if (a.container === true && b.container === false) { // Push containers to the top.
                            return -1;
                        } else if (a.container === false && b.container === true) { // Push container to the top.
                            return 1;
                        } else {
                            return a.schema.name > b.schema.name ? 1 : -1; // If both nodes are containers or both are not - order by name.
                        }
                    })
                    .map(node => {
                        return node.schema;
                    }));

        this.searching$ = searchParams$
            .map(({ keyword, tags }) => keyword !== '' || tags !== '');
    }

    onFileUploadClicked() {
        this.fileDropArea.openModalDialog([]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private groupNodesBySchema(nodes: MeshNode[]): { [schemaUuid: string]: MeshNode[]; } {
        nodes = nodes.sort((a: MeshNode, b: MeshNode) => {
            return a.displayName > b.displayName ? 1 : -1;
        });

        const childrenBySchema: { [schemaUuid: string]: MeshNode[] } = {};
        for (const node of nodes || []) {
            if (!childrenBySchema[node.schema.uuid]) {
                childrenBySchema[node.schema.uuid] = [];
            }
            childrenBySchema[node.schema.uuid].push(node);
        }
        return childrenBySchema;
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

    private filterNodes (childNodes: MeshNode[], filterTerm: string): MeshNode[] {
        return childNodes.reduce((filteredNodes, node) => {
            const matchedNode = fuzzyMatch(filterTerm, node.displayName);
            return matchedNode ? [...filteredNodes, node] : filteredNodes;
        }, []);
    }
}
