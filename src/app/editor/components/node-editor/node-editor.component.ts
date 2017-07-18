import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { testNode, testSchema } from './mock-data';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';
import { FormGeneratorComponent } from '../../form-generator/components/form-generator/form-generator.component';

@Component({
    selector: 'node-editor',
    templateUrl: './node-editor.component.html',
    styleUrls: ['./node-editor.scss'],
    // TODO: set to OnPush - needs changeDetector work in FormGenerator
    changeDetection: ChangeDetectionStrategy.Default
})

export class NodeEditorComponent implements OnInit, OnDestroy {
    node: MeshNode = testNode;
    schema: Schema = testSchema;
    nodeTitle: string = '';
    @ViewChild(FormGeneratorComponent) formGenerator: FormGeneratorComponent;

    constructor(
        private state: ApplicationStateService,
        private changeDetector: ChangeDetectorRef,
        private editorEffects: EditorEffectsService,
        private navigationService: NavigationService,
        private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const projectName = paramMap.get('projectName');
            const nodeUuid = paramMap.get('nodeUuid');
            if (projectName && nodeUuid) {
                this.editorEffects.openNode(projectName, nodeUuid);
            }
        });

        this.state.select(state => state.editor.openNode && state.editor.openNode.uuid)
            .filter(nodeUuid => nodeUuid != null)
            .switchMap(uuid =>
                Observable.combineLatest(
                    this.state.select(state => state.entities.node[uuid])
                        .filter<MeshNode>(Boolean),
                    this.state.select(state =>
                        state.entities.node[uuid] && state.entities.schema[state.entities.node[uuid].schema.uuid])
                        .filter<Schema>(Boolean)
                )
            )
            .subscribe(([node, schema]) => {
                this.formGenerator.setPristine();
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
        const breadcrumbs = this.node.breadcrumb.map(b => b.displayName);
        // TODO: remove this once Mesh fixes the order of the breadcrumbs
        breadcrumbs.reverse();

        return [this.node.project.name, ...breadcrumbs].join(' › ');
    }

    getNodePathRouterLink(): any[] {
        if (this.node.project.name) {
            return this.navigationService.list(this.node.project.name, this.node.parentNode.uuid).commands();
        } else {
            return [];
        }
    }

    /** Returns true if the node is a draft version i.e. not a whole number version */
    isDraft(): boolean {
        return !/\.0$/.test(this.node.version);
    }

    saveNode(): void {
        if (this.formGenerator.isDirty) {
            this.editorEffects.saveNode(this.node);
        }
    }

    publishNode(): void {
        if (this.isDraft()) {
            this.editorEffects.publishNode(this.node);
        }
    }

    closeEditor(): void {
        this.navigationService.clearDetail().navigate();
    }

    private getNodeTitle(): string {
        if (this.node.displayField) {
            return this.node.fields[this.node.displayField];
        } else {
            return this.node.uuid;
        }
    }
}
