import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService, ValidDetailCommands } from '../../../core/providers/navigation/navigation.service';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';
import { FormGeneratorComponent } from '../../form-generator/components/form-generator/form-generator.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { simpleCloneDeep } from '../../../common/util/util';
import { initializeNode } from '../../form-generator/common/initialize-node';
import { NodeReferenceFromServer } from '../../../common/models/server-models';
import { I18nService } from '../../../core/providers/i18n/i18n.service';

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
    @ViewChild(FormGeneratorComponent) formGenerator: FormGeneratorComponent;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private changeDetector: ChangeDetectorRef,
                private editorEffects: EditorEffectsService,
                private navigationService: NavigationService,
                private route: ActivatedRoute,
                private i18n: I18nService) {}

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
                console.log('Create new node on its way');
                this.editorEffects.createNode(projectName, schemaUuid, parentNodeUuid, language);
            }
        });

        const openNode$ = Observable.combineLatest(
            this.state.select(state => state.editor.openNode && state.editor.openNode.uuid),
            this.state.select(state => state.editor.openNode && state.editor.openNode.language),
            this.state.select(state => state.editor.openNode && state.editor.openNode.schemaUuid),
            this.state.select(state => state.editor.openNode && state.editor.openNode.parentNodeUuid),
        )
            .switchMap(([uuid, language, schemaUuid, parentNodeUuid]) => {
                if (!!schemaUuid) {
                    return this.entities.selectSchema(schemaUuid).map((schema) => {
                        const node = initializeNode(schema, parentNodeUuid, language);
                        return [node, schema] as [MeshNode, Schema];
                    });
                } else {
                    const node$ = this.entities.selectNode(uuid, { language });
                    return Observable.combineLatest(
                        node$.filter<MeshNode>(Boolean).map(node => simpleCloneDeep(node)),
                        node$.switchMap(node => this.entities.selectSchema(node.schema.uuid))
                    );
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
    }

    getNodePath(): string {
        if (!this.node) {
            return '';
        }

        let breadcrumb: NodeReferenceFromServer[] = [];
        if (this.node.breadcrumb) {
            breadcrumb = this.node.breadcrumb;
        } else {
            breadcrumb = this.entities.getNode(this.node.parentNode.uuid, { language : this.node.language }).breadcrumb;
            console.log(breadcrumb);
            // breadcrumb.unshift({ displayName: this.i18n.translate('editor.create_node') } as any);
        }
        // TODO: remove this once Mesh fixes the order of the breadcrumbs
        return breadcrumb.reverse().map(b => b.displayName).join(' › ');
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
    saveNode(): void {
        if (this.node && this.formGenerator.isDirty) {
            this.editorEffects.saveNode(this.node);
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
