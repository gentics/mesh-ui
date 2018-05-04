import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IModalInstance, ModalService } from 'gentics-ui-core';

import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EditorEffectsService } from '../../providers/editor-effects.service';

import { NodeReferenceFromServer, NodeResponse, TagReferenceFromServer } from '../../../common/models/server-models';
import { initializeNode } from '../../../common/util/initialize-node';
import { getMeshNodeBinaryFields, notNullOrUndefined, simpleCloneDeep } from '../../../common/util/util';
import { ApiBase } from '../../../core/providers/api/api-base.service';
import { ApiError } from '../../../core/providers/api/api-error';
import { ApiService } from '../../../core/providers/api/api.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { FormGeneratorComponent } from '../../../form-generator/components/form-generator/form-generator.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { tagsAreEqual } from '../../form-generator/common/tags-are-equal';
import { NodeConflictDialogComponent } from '../node-conflict-dialog/node-conflict-dialog.component';
import { NodeTagsBarComponent } from '../node-tags-bar/node-tags-bar.component';
import { ProgressbarModalComponent } from '../progressbar-modal/progressbar-modal.component';

@Component({
    selector: 'mesh-node-editor',
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
    // TODO: make a fullscreen non-closable dialog for binary files preventing user from navigating away while file is uploading
    // isSaving$: Observable<boolean>;
    isSaving = false;

    private openNode$: Subscription;

    @ViewChild('formGenerator') formGenerator?: FormGeneratorComponent;
    @ViewChild('tagsBar') tagsBar?: NodeTagsBarComponent;

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private changeDetector: ChangeDetectorRef,
        private editorEffects: EditorEffectsService,
        private listEffects: ListEffectsService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private i18n: I18nService,
        private modalService: ModalService,
        private apiBase: ApiBase,
        private api: ApiService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const projectName = paramMap.get('projectName');
            const nodeUuid = paramMap.get('nodeUuid');
            const schemaUuid = paramMap.get('schemaUuid');
            const parentNodeUuid = paramMap.get('parentNodeUuid');
            const language = paramMap.get('language');

            if (projectName && nodeUuid && language) {
                setTimeout(() => {
                    // Opening the node needs to be done on the next change detection tick,
                    // otherwise the parent component (MasterDetailComponent) will report
                    // a change detection error in dev mode.
                    this.editorEffects.openNode(projectName, nodeUuid, language);
                });
            } else if (projectName && schemaUuid && parentNodeUuid && language) {
                this.editorEffects.createNode(projectName, schemaUuid, parentNodeUuid, language);
            } else {
                throw new Error(`Cannot open or create a node. Required parameters are missing.`);
            }
        });

        this.openNode$ = this.state
            .select(state => state.editor.openNode)
            .filter(notNullOrUndefined)
            .switchMap(openNode => {
                const schemaUuid = openNode.schemaUuid;
                const parentNodeUuid = openNode.parentNodeUuid;
                if (schemaUuid && parentNodeUuid) {
                    return this.entities.selectSchema(schemaUuid).map(schema => {
                        const node = initializeNode(schema, parentNodeUuid, openNode.language);
                        return [node, schema] as [MeshNode, Schema];
                    });
                } else {
                    const node$ = this.entities.selectNode(openNode.uuid, { language: openNode.language });
                    const latest = Observable.combineLatest(
                        node$.filter<MeshNode>(Boolean).map(node => {
                            return simpleCloneDeep(node);
                        }),
                        node$.switchMap(node => {
                            return this.entities.selectSchema(node.schema.uuid!);
                        })
                    );
                    return latest;
                }
            })
            .subscribe(([node, schema]) => {
                if (this.formGenerator) {
                    this.formGenerator.setPristine(node);
                }
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

        const parentNode = this.entities.getNode(this.node.parentNode.uuid, { language: this.node.language });
        const parentDisplayNode = { displayName: parentNode ? parentNode.displayName : '' } as NodeReferenceFromServer;
        let breadcrumb = this.node.breadcrumb;

        if (!breadcrumb && parentNode) {
            const createNodeBreadcrumb: NodeReferenceFromServer = {
                displayName: this.i18n.translate('editor.create_node')
            } as NodeReferenceFromServer;
            breadcrumb = [createNodeBreadcrumb, parentDisplayNode, ...parentNode.breadcrumb];
        } else if (!breadcrumb && parentNode) {
            breadcrumb = [parentDisplayNode, ...parentNode.breadcrumb];
        } else {
            breadcrumb = [{ displayName: this.node.displayName } as NodeReferenceFromServer, ...breadcrumb];
        }
        // TODO: remove this once Mesh fixes the order of the breadcrumbs
        // https://github.com/gentics/mesh/issues/398
        return breadcrumb
            .slice()
            .reverse()
            .map(b => b.displayName)
            .join(' › ');
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
     * Carries on the saving process and displays a loading overlay if any binary fields has to be uploaded.
     */
    private saveNodeWithProgress(saveFn: Promise<any> | null, node: MeshNode): Promise<any> {
        const numBinaryFields = Object.keys(getMeshNodeBinaryFields(node)).length;

        if (numBinaryFields > 0) {
            return this.modalService
                .fromComponent(
                    ProgressbarModalComponent,
                    {
                        closeOnOverlayClick: false,
                        closeOnEscape: false
                    },
                    {
                        translateToPlural: numBinaryFields > 1
                    }
                )
                .then(modal => {
                    modal.open();
                    if (saveFn) {
                        saveFn.then(() => modal.instance.closeFn(null));
                    }
                });
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Validate if saving is required.
     * Open a file upload progress if binary fields are present upload.
     * Tags might be explicitly passed in if we are solving the conflicts and we chose the tags from the remote version. Otherwise look if tags were edited or not (tagsBar.isDirty)
     *
     */
    saveNode(navigateOnSave = true, tags?: TagReferenceFromServer[]): void {
        // TODO: remove the test case when done with conflict resolution.
        // To quickly test the handleSaveConflicts, uncomment bellow:
        /*
            this.handleSaveConflicts(['name', 'pets', 'number', 'Html', 'Adate', 'othernode', 'Bool', 'microschema.name', 'microschema.number']);
            return;
        */
        const formGenerator = this.formGenerator;
        const tagsBar = this.tagsBar;
        if (!this.node || !formGenerator || !tagsBar) {
            throw new Error('Could not save node. One or more expected objects were not present.');
        }
        if (this.isDirty) {
            this.isSaving = true;
            let saveFn: Promise<any> | null = null;
            tags = !!tags ? tags : tagsBar.isDirty ? tagsBar.nodeTags : undefined;

            if (!this.node.uuid) {
                // Create new node.
                const parentNode = this.entities.getNode(this.node.parentNode.uuid, { language: this.node.language });
                const projectName = parentNode && parentNode.project.name;
                if (parentNode && projectName) {
                    saveFn = this.editorEffects.saveNewNode(projectName, this.node, tags).then(
                        node => {
                            this.isSaving = false;
                            if (node && node.language) {
                                formGenerator.setPristine(node);
                                this.listEffects.loadChildren(projectName, parentNode.uuid, node.language);

                                if (navigateOnSave) {
                                    this.navigationService.detail(projectName, node.uuid, node.language).navigate();
                                }
                            }
                        },
                        error => {
                            this.isSaving = false;
                            this.changeDetector.detectChanges();
                        }
                    );
                }
            } else {
                saveFn = this.editorEffects.saveNode(this.node, tags).then(
                    node => {
                        this.isSaving = false;
                        if (node && node.project.name && node.language) {
                            formGenerator.setPristine(node);
                            this.listEffects.loadChildren(node.project.name, node.parentNode.uuid, node.language);
                            this.changeDetector.markForCheck();
                        }
                    },
                    error => {
                        if (error.response) {
                            const errorResponse = error.response.json();
                            if (errorResponse.type === 'node_version_conflict') {
                                this.handleSaveConflicts(errorResponse.properties.conflicts);
                            }
                        }
                        this.isSaving = false;
                    }
                );
            }
            this.saveNodeWithProgress(saveFn, this.node);
        }
    }

    handleSaveConflicts(conflicts: string[]): void {
        if (!this.node) {
            throw new Error('Cannot handle save conflicts because this.node is undefined.');
        }
        this.api.project
            .getNode({ project: this.node.project.name!, nodeUuid: this.node.uuid })
            .take(1)
            .subscribe((response: NodeResponse) => {
                this.modalService
                    .fromComponent(
                        NodeConflictDialogComponent,
                        {
                            closeOnOverlayClick: false,
                            width: '90%',
                            onClose: (reason: any): void => {
                                this.changeDetector.detectChanges();
                            }
                        },
                        {
                            conflicts,
                            localTags: this.tagsBar ? this.tagsBar.nodeTags : [],
                            localNode: this.node,
                            remoteNode: response as MeshNode
                        }
                    )
                    .then(modal => modal.open())
                    .then(mergedNode => {
                        this.node = mergedNode;
                        this.saveNode(true, mergedNode.tags);
                    });
            });
    }

    /**
     * Publish the node, and if there are changes, save first before publishing.
     */
    publishNode(): void {
        if (this.node && this.tagsBar && this.isDraft()) {
            const tags = this.tagsBar.isDirty ? this.tagsBar.nodeTags : undefined;
            const promise = this.isDirty ? this.editorEffects.saveNode(this.node, tags) : Promise.resolve(this.node);

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

    get isDirty(): boolean {
        return (!!this.formGenerator && this.formGenerator.isDirty) || (!!this.tagsBar && this.tagsBar.isDirty);
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
