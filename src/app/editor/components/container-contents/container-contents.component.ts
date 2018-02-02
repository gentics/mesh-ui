import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { SchemaReference } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { notNullOrUndefined } from '../../../common/util/util';
import { EntitiesService } from '../../../state/providers/entities.service';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';


@Component({
    selector: 'container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerContentsComponent implements OnInit, OnDestroy {

    listLanguage: string;
    filter: string;
    childNodes: MeshNode[] | undefined;

    private subscription: Subscription;
    /** @internal */
    public schemas: SchemaReference[] = [];
    /** @internal */
    public childrenBySchema: { [schemaUuid: string]: MeshNode[] } = { };

    constructor(private changeDetector: ChangeDetectorRef,
                private listEffects: ListEffectsService,
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

        const list$ = this.state.select(state => state.list.children);
        const childNodesSub = this.state.select(state => state.list.children)
            .map(childrenUuids =>
                    childrenUuids && childrenUuids
                    .map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }))
            )
            .subscribe(childNodes => {
                this.childNodes = childNodes;
                this.updateChildList();
            })


        const filterSub = this.state.select(state => state.list.filter)
            .subscribe(filter => {
                this.filter = filter.trim();
                this.updateChildList();
            });

        const onProjectLoadSchemasSub = this.state
            .select(state => state.list.currentProject!)
            .filter<string>(notNullOrUndefined)
            .subscribe(projectName => {
                this.listEffects.loadSchemasForProject(projectName);
                this.listEffects.loadMicroschemasForProject(projectName);
            });

        this.subscription = routerParamsSub
            .add(languageSub)
            .add(childNodesSub)
            .add(onProjectLoadSchemasSub)
    }

    /**Matches the some fields of the node with the filter */
    private selectNodesByFilter = (node:MeshNode): boolean => {
        //no filter set, return all the results
        if (!this.filter) {
            return true;
        }

        const matches: string[] = fuzzyMatch(this.filter, node.displayName);
        return matches && matches.length > 0;
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
                containerUuid: paramMap.get('containerUuid')!,
                projectName: paramMap.get('projectName')!,
                language: paramMap.get('language')!
            }))
            .distinctUntilChanged((a, b) =>
                a.containerUuid === b.containerUuid &&
                a.projectName === b.projectName &&
                a.language === b.language
            );
    }

    private updateChildList(): void {
        const schemas: SchemaReference[] = [];
        const childrenBySchema: { [schemaUuid: string]: MeshNode[] } = {};

        const filteredNodes = this.childNodes.filter(this.selectNodesByFilter);

        for (const node of filteredNodes || []) {
            if (!schemas.some(schema => node.schema.uuid === schema.uuid)) {
                schemas.push(node.schema);
                childrenBySchema[node.schema.uuid] = [];
            }

            childrenBySchema[node.schema.uuid].push(node);
        }

        this.schemas = schemas;
        this.childrenBySchema = childrenBySchema;
        this.changeDetector.markForCheck();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
