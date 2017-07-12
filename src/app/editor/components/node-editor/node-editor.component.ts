import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { testNode, testSchema } from './mock-data';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'node-editor',
    templateUrl: './node-editor.component.html',
    styleUrls: ['./node-editor.scss']
})

export class NodeEditorComponent implements OnInit, OnDestroy {
    node: MeshNode = testNode;
    schema: Schema = testSchema;

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
                this.node = node;
                this.schema = schema;
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.editorEffects.closeEditor();
    }

    closeEditor(): void {
        this.navigationService.clearDetail().navigate();
    }
}
