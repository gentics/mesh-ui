import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MeshNode } from '../../../common/models/node.model';
import * as NodeUtil from '../../../common/util/node-util';
import { EditorEffectsService } from '../../../editor/providers/editor-effects.service';

@Component({
    selector: 'mesh-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.scss']
})
export class PublishOptionsComponent implements OnInit {
    @Input() node: MeshNode;

    @Input() beforePublish: () => Promise<any> | undefined;

    nodeUtil = NodeUtil;

    constructor(private editorEffects: EditorEffectsService) {}

    ngOnInit() {}

    async publishNode() {
        if (this.beforePublish) {
            await this.beforePublish();
        }
        this.editorEffects.publishNode(this.node);
    }

    async publishNodeLanguage() {
        if (this.beforePublish) {
            await this.beforePublish();
        }
        this.editorEffects.publishNodeLanguage(this.node);
    }

    unpublishNode(): void {
        this.editorEffects.unpublishNode(this.node);
    }

    unpublishNodeLanguage(): void {
        this.editorEffects.unpublishNodeLanguage(this.node);
    }
}
