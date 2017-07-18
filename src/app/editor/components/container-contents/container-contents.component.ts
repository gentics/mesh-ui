import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { SchemaReference } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { notNullOrUndefined } from '../../../common/util/util';


@Component({
    selector: 'container-contents',
    templateUrl: './container-contents.component.html',
    styleUrls: ['./container-contents.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerContentsComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    /** @internal */
    public schemas: SchemaReference[] = [];
    /** @internal */
    public childrenBySchema: { [schemaUuid: string]: MeshNode[] } = { };

    constructor(
        private changeDetector: ChangeDetectorRef,
        private listEffects: ListEffectsService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private state: ApplicationStateService) {
    }

    ngOnInit(): void {
        const onLogin$ = this.state.select(state => state.auth.loggedIn)
            .filter(loggedIn => loggedIn);

        const routerParams$ = onLogin$
            .switchMapTo(this.route.paramMap)
            .filter(params => params.has('containerUuid') && params.has('projectName'))
            .map(paramMap => ({
                containerUuid: paramMap.get('containerUuid')!,
                projectName: paramMap.get('projectName')!
            }))
            .distinctUntilChanged((a, b) =>
                a.containerUuid === b.containerUuid && a.projectName === b.projectName);

        const childNodes$ = this.state.select(state => state.list.currentNode)
                .combineLatest(this.state.select(state => state.entities.node))
                .map(([containerUuid, nodes]) => containerUuid)
                .switchMap(containerUuid =>
                    this.state.select(state => {
                        const node = state.entities.node[containerUuid!];
                        return node && node.children;
                    })
                    .map(childrenUuids => {
                        const nodes = this.state.now.entities.node;
                        return childrenUuids && childrenUuids.map(uuid => nodes[uuid]);
                    })
        );

        const onProjectLoadSchemas = this.state
            .select(state => state.list.currentProject)
            .filter<string>(notNullOrUndefined)
            .subscribe(projectName => {
                this.listEffects.loadSchemasForProject(projectName);
            });

        this.subscription = routerParams$
            .subscribe(({ containerUuid, projectName }) => {
                this.listEffects.setActiveContainer(projectName, containerUuid);
            })
            .add(childNodes$.subscribe(childNodes => this.updateChildList(childNodes)));
    }

    private updateStateWhenRouteChanges(): Subscription {
        return this.state
            .select(state => state.auth.loggedIn)
            .filter(loggedIn => loggedIn)
            .switchMapTo(this.route.paramMap)
            .filter(params => params.has('containerUuid') && params.has('projectName'))
            .map(paramMap => ({
                containerUuid: paramMap.get('containerUuid')!,
                projectName: paramMap.get('projectName')!
            }))
            .distinctUntilChanged((a, b) =>
                a.containerUuid === b.containerUuid && a.projectName === b.projectName)
            .subscribe(({ containerUuid, projectName }) => {
                this.listEffects.setActiveContainer(projectName, containerUuid);
            });
    }

    private refreshOnStateChanges(): Subscription {
        return this.state
            .select(state => {
                const node = state.entities.node[state.list.currentNode!];
                return node && node.children || undefined;
            })
            .filter(notNullOrUndefined)
            .switchMap(childUuids =>
                this.state.select(state => state.entities.node)
                    .map(nodes => childUuids.map(uuid => nodes[uuid]))
                    .distinctUntilChanged()
            )
            .subscribe(children => this.updateChildList(children));
    }

    private updateChildList(childNodes: MeshNode[] | undefined): void {
        const schemas: SchemaReference[] = [];
        const childrenBySchema: { [schemaUuid: string]: MeshNode[] } = {};

        for (const node of childNodes || []) {
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

    editNode(node: MeshNode): void {
        this.navigationService.detail(node.project.name!, node.uuid).navigate();
    }

    copyNode(node: MeshNode): void {
        // TODO
    }

    moveNode(node: MeshNode): void {
        // TODO
    }

    deleteNode(node: MeshNode): void {
        // TODO
    }

    routerLinkOf(node: MeshNode) {
        if (node.container) {
            return this.navigationService.list(node.project.name!, node.uuid).commands();
        } else {
            return this.navigationService.detail(node.project.name!, node.uuid).commands();
        }
    }
}
