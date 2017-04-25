import { Component, OnDestroy, OnInit } from '@angular/core';
import { testNode, testSchema } from './mock-data';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../shared/providers/navigation/navigation.service';

@Component({
    selector: 'node-editor',
    templateUrl: './node-editor.component.html',
    styleUrls: ['./node-editor.scss']
})

export class NodeEditorComponent implements OnInit, OnDestroy {
    node = testNode;
    schema = testSchema;

    constructor(private editorEffects: EditorEffectsService,
                private navigationService: NavigationService,
                private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const projectName = paramMap.get('projectName');
            const nodeUuid = paramMap.get('nodeUuid');
            if (projectName && nodeUuid) {
                this.editorEffects.openNode(projectName, nodeUuid);
            }
        });
    }

    ngOnDestroy(): void {
        this.editorEffects.closeEditor();
    }

    closeEditor(): void {
        this.navigationService.clearDetail().navigate();
    }
}
