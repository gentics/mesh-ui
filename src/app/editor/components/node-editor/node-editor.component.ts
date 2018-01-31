import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { NavigationService, ValidDetailCommands } from '../../../core/providers/navigation/navigation.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

import { FormGeneratorComponent } from '../../form-generator/components/form-generator/form-generator.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { simpleCloneDeep, getMeshNodeBinaryFields } from '../../../common/util/util';
import { initializeNode } from '../../form-generator/common/initialize-node';
import { NodeReferenceFromServer, NodeResponse, FieldMapFromServer } from '../../../common/models/server-models';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { ModalService, IDialogConfig, IModalOptions, IModalInstance } from 'gentics-ui-core';
import { ProgressbarModalComponent } from '../progressbar-modal/progressbar-modal.component';

@Component({
    selector: 'node-editor',
    templateUrl: './node-editor.component.html',
    styleUrls: ['./node-editor.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeEditorComponent implements OnInit, OnDestroy {
    node: MeshNode | undefined;
    schema: Schema | undefined;
    nodePathRouterLink: any[];
    nodePath: string;
    nodeTitle = '';
    //TODO: make a fullscreen non-closable dialog for binary files preventing user from navigating away while file is uploading
    //isSaving$: Observable<boolean>;
    isSaving = false;

    private openNode$: Subscription;

    @ViewChild(FormGeneratorComponent) formGenerator: FormGeneratorComponent;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private changeDetector: ChangeDetectorRef,
                private editorEffects: EditorEffectsService,
                private listEffects: ListEffectsService,
                private navigationService: NavigationService,
                private route: ActivatedRoute,
                private i18n: I18nService,
                private modalService: ModalService ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const projectName = paramMap.get('projectName');
            const nodeUuid = paramMap.get('nodeUuid');
            const schemaUuid = paramMap.get('schemaUuid');
            const parentNodeUuid = paramMap.get('parentNodeUuid');
            const command = paramMap.get('command') as ValidDetailCommands;
            const language = paramMap.get('language');

            if (projectName && nodeUuid && language) {
                this.editorEffects.openNode(projectName, nodeUuid, language);
            } else {
                this.editorEffects.createNode(projectName, schemaUuid, parentNodeUuid, language);
            }
        });

        this.openNode$ = this.state.select(state => state.editor.openNode)
            .filter(Boolean)
            .switchMap(openNode => {

                // const {uuid, language, schemaUuid, parentNodeUuid} = openNode;
                const schemaUuid = openNode && openNode.schemaUuid;
                if (schemaUuid) {
                    return this.entities.selectSchema(schemaUuid).map((schema) => {
                        const node = initializeNode(schema, openNode.parentNodeUuid, openNode.language);
                        return [node, schema] as [MeshNode, Schema];
                    });
                } else {
                    const node$ = this.entities.selectNode(openNode.uuid, { language: openNode.language });
                    const latest = Observable.combineLatest(
                        node$.filter<MeshNode>(Boolean).map(node => {
                            return simpleCloneDeep(node);
                        }),
                        node$.switchMap(node => {
                            return this.entities.selectSchema(node.schema.uuid);
                        })
                    );
                    return latest;
                }
            })
            .subscribe(([node, schema]) => {
                this.formGenerator.setPristine(node);
                this.node = node;
                this.schema = schema;
                this.nodeTitle = this.getNodeTitle();
                this.changeDetector.markForCheck();
                this.nodePathRouterLink = this.getNodePathRouterLink();
                this.nodePath = this.getNodePath();
            });
    }

    ngOnDestroy(): void {
        this.editorEffects.closeEditor();
        this.openNode$.unsubscribe();
    }

    getNodePath(): string {
        if (!this.node) {
            return '';
        }

        const parentNode = this.entities.getNode(this.node.parentNode.uuid, { language : this.node.language });
        // const parentDisplayNode: any = { displayName: parentNode.displayName || '' };
        const parentDisplayNode: NodeReferenceFromServer = { displayName: parentNode.displayName || '' } as NodeReferenceFromServer;
        let breadcrumb = this.node.breadcrumb;

        if (!breadcrumb && parentNode) {
            const createNodeBreadcrumb: NodeReferenceFromServer = {
                displayName: this.i18n.translate('editor.create_node')
            } as NodeReferenceFromServer;
            breadcrumb = [createNodeBreadcrumb, parentDisplayNode, ...parentNode.breadcrumb];
        } else if (!breadcrumb) {
            breadcrumb = [parentDisplayNode, ...parentNode.breadcrumb];
        } else {
            breadcrumb = [{ displayName: this.node.displayName} as NodeReferenceFromServer, ...breadcrumb];
        }
        // TODO: remove this once Mesh fixes the order of the breadcrumbs
        return breadcrumb.slice().reverse().map(b => b.displayName).join(' › ');
    }

    getNodePathRouterLink(): any[] {
        if (!this.node) {
            return [];
        }
        if (this.node.project && this.node.project.name) {
            return this.navigationService.list(this.node.project.name, this.node.parentNode.uuid).commands();
        } else {
            return [];
        }
    }

    /** Returns true if the node is a draft version i.e. not a whole number version */
    isDraft(): boolean {
        return !!this.node && !/\.0$/.test(this.node.version);
    }

    /**
     * Save the node as a new draft version.
     */
    saveNode(navigateOnSave = true): void {
        if (!this.node) {
            return;
        }

        if (this.formGenerator.isDirty) {

            this.isSaving = true;

            const numFields = Object.keys(getMeshNodeBinaryFields(this.node)).length;

            if (numFields > 0) {
                this.modalService.fromComponent(ProgressbarModalComponent,
                                                {
                                                    closeOnOverlayClick: false,
                                                    closeOnEscape: false
                                                },
                                                {
                                                    translateToPlural: numFields > 1
                                                })
                .then(modal => {
                    modal.open();
                    this.saveNodeWithModal(navigateOnSave, modal);
                });
            } else {
                this.saveNodeWithModal(navigateOnSave);
            }
        }
    }

    private saveNodeWithModal(navigateOnSave: boolean, modal?: IModalInstance<ProgressbarModalComponent>): void {
        if (!this.node.uuid) {
            const parentNode = this.entities.getNode(this.node.parentNode.uuid, { language : this.node.language });
            this.editorEffects.saveNewNode(parentNode.project.name, this.node)
                .then(node => {
                    this.isSaving = false;
                    if (node) {
                        this.formGenerator.setPristine(node);
                        this.listEffects.loadChildren(parentNode.project.name, parentNode.uuid, node.language);

                        if (navigateOnSave) {
                            this.navigationService.detail(parentNode.project.name, node.uuid, node.language).navigate();
                        }
                    }
                    if (modal) {
                        modal.instance.closeFn(null);
                    }
            }, error => {
                this.isSaving = false;

                if (modal) {
                    modal.instance.closeFn(null);
                }
            });
        } else {
            this.editorEffects.saveNode(this.node)
                .then(node => {
                    this.isSaving = false;
                    if (node) {
                        this.formGenerator.setPristine(node);
                        this.listEffects.loadChildren(node.project.name, node.parentNode.uuid, node.language);
                    }

                    if (modal) {
                        modal.instance.closeFn(null);
                    }
                }, error => {
                    this.isSaving = false;

                    if (modal) {
                        modal.instance.closeFn(null);
                    }
                });
        }
    }



    /**
     * Publish the node, and if there are changes, save first before publishing.
     */
    publishNode(): void {
        if (this.node && this.isDraft()) {
            const promise = this.formGenerator.isDirty ?
                this.editorEffects.saveNode(this.node) :
                Promise.resolve(this.node);

            promise.then(node => {
                if (node) {
                    this.editorEffects.publishNode(node);
                }
            });
        }
    }

    closeEditor(): void {
        this.navigationService.clearDetail().navigate();
    }

    focusList(): void {
        this.state.actions.editor.focusList();
    }

    private getNodeTitle(): string {
        if (!this.node) {
            return '';
        }
        if (this.node.displayField) {
            return this.node.fields[this.node.displayField];
        } else {
            return this.node.uuid;
        }
    }
}
