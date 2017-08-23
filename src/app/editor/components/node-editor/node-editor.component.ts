import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';
import { FormGeneratorComponent } from '../../form-generator/components/form-generator/form-generator.component';
import { EntitiesService } from '../../../state/providers/entities.service';
import { simpleCloneDeep } from '../../../common/util/util';

@Component({
    selector: 'node-editor',
    templateUrl: './node-editor.component.html',
    styleUrls: ['./node-editor.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NodeEditorComponent implements OnInit, OnDestroy {
    node: MeshNode | undefined;
    schema: Schema | undefined;
    nodeTitle: string = '';
    @ViewChild(FormGeneratorComponent) formGenerator: FormGeneratorComponent;

    constructor(private state: ApplicationStateService,
                private entities: EntitiesService,
                private changeDetector: ChangeDetectorRef,
                private editorEffects: EditorEffectsService,
                private navigationService: NavigationService,
                private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const projectName = paramMap.get('projectName');
            const nodeUuid = paramMap.get('nodeUuid');
            const language = paramMap.get('language');
            if (projectName && nodeUuid && language) {
                this.editorEffects.openNode(projectName, nodeUuid, language);
            }
        });

        Observable.combineLatest(
            this.state.select(state => state.editor.openNode && state.editor.openNode.uuid),
            this.state.select(state => state.editor.openNode && state.editor.openNode.language)
        )
            .switchMap(([uuid, language]) => {
                const node$ = this.entities.selectNode(uuid, { language });
                return Observable.combineLatest(
                    node$.filter<MeshNode>(Boolean).map(node => simpleCloneDeep(node)),
                    node$.switchMap(node => this.entities.selectSchema(node.schema.uuid))
                );
            })
            .subscribe(([node, schema]) => {
                this.formGenerator.setPristine(node);
                this.node = node;
                this.schema = schema;
                this.nodeTitle = this.getNodeTitle();
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.editorEffects.closeEditor();
    }

    getNodePath(): string {
        if (!this.node) {
            return '';
        }
        const breadcrumbs = this.node.breadcrumb.map(b => b.displayName);
        // TODO: remove this once Mesh fixes the order of the breadcrumbs
        breadcrumbs.reverse();

        return [this.node.project.name, ...breadcrumbs].join(' › ');

    }

    getNodePathRouterLink(): any[] {
        if (!this.node) {
            return [];
        }
        if (this.node.project.name) {
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
