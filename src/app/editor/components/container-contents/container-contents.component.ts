import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ModalService, IDialogConfig } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { SchemaReference } from '../../../common/models/common.model';
import { MeshNode } from '../../../common/models/node.model';
import { notNullOrUndefined } from '../../../common/util/util';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ApiService } from '../../../core/providers/api/api.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';



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
    public childrenBySchema: { [schemaUuid: string]: MeshNode[] } = { };

    constructor(
        private changeDetector: ChangeDetectorRef,
        private listEffects: ListEffectsService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private entities: EntitiesService,
        private state: ApplicationStateService,
        private api: ApiService,
        private i18n: I18nService,
        private modalService: ModalService) {
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
            .map(childrenUuids =>
                childrenUuids && childrenUuids
                    .map(uuid => this.entities.getNode(uuid, { language: this.listLanguage }))
                    .filter<MeshNode>(notNullOrUndefined)
            )
            .subscribe(childNodes => this.updateChildList(childNodes));

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
            .add(onProjectLoadSchemasSub);
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
        this.navigationService.detail(node.project.name!, node.uuid, node.language).navigate();
    }

    copyNode(node: MeshNode): void {
        // TODO
    }

    moveNode(node: MeshNode): void {
        // TODO
    }

    deleteNode(node: MeshNode): void {
        const dialogConfig: IDialogConfig = {
            title: this.i18n.translate('modal.delete_node_title'),
            body: this.i18n.translate('modal.delete_node_body', { name: node.displayName }),
            buttons: [
                { label: this.i18n.translate('common.cancel_button'), type: 'secondary', shouldReject: true },
                { label: this.i18n.translate('common.delete_button'), type: 'alert', returnValue: true }
            ]
        };

        this.modalService.dialog(dialogConfig)
            .then(modal => modal.open())
            .then(() => {
                this.api.project.deleteNode({ project: node.project.name, nodeUuid: node.uuid, recursive: true })
                .take(1)
                .subscribe(result => {
                    console.warn('implement check if delete happened');
                    const parentNode = this.entities.getNode(node.parentNode.uuid, { language : node.language });
                    this.listEffects.loadChildren(parentNode.project.name, parentNode.uuid, parentNode.language);
                });
            });
    }

    routerLinkOf(node: MeshNode) {
        if (node.container) {
            return this.navigationService.list(node.project.name!, node.uuid, this.listLanguage).commands();
        } else {
            return this.navigationService.detail(node.project.name!, node.uuid, node.language).commands();
        }
    }

    focusEditor() {
        this.state.actions.editor.focusEditor();
    }
}
