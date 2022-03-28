import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { NodeListResponse, NodeResponse } from 'src/app/common/models/server-models';
import { ListEffectsService } from 'src/app/core/providers/effects/list-effects.service';

import { MeshNode } from '../../../common/models/node.model';
import * as NodeUtil from '../../../common/util/node-util';
import { EditorEffectsService } from '../../../editor/providers/editor-effects.service';
import { EMeshNodeStatusStrings } from '../node-status/node-status.component';

@Component({
    selector: 'mesh-publish-all-options',
    templateUrl: './publish-all-options.component.html',
    styleUrls: ['./publish-all-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublishAllOptionsComponent implements OnInit, AfterViewChecked {
    _publishInformationNeedsToBeRefreshed = false;
    _contentChanged = false;
    _status: 'error' | 'loading' | 'loaded' = 'loading';

    // all nodes of current language
    _nodesCurrentLanguage: MeshNode[] = [];

    // all nodes
    _nodes: MeshNode[] = [];

    _projectName: string | null = null;
    @Input() set projectName(value: string) {
        this._projectName = value;
        this.tryToLoadPublishInformationForAllChildren();
    }

    _containerUuid: string | null = null;
    @Input() set containerUuid(value: string) {
        this._containerUuid = value;
        this.tryToLoadPublishInformationForAllChildren();
    }

    _language: string | null = null;
    @Input() set language(value: string) {
        this._language = value;
        this.tryToLoadPublishInformationForAllChildren();
    }

    _nodeStatusesToBeConsidered: EMeshNodeStatusStrings[] = [];
    @Input() set nodeStatusesToBeConsidered(value: EMeshNodeStatusStrings[]) {
        this._nodeStatusesToBeConsidered = value;
        this.tryToLoadPublishInformationForAllChildren();
    }

    @Input() beforePublish: () => Promise<any> | undefined;

    @Output() contentUpdated: EventEmitter<void> = new EventEmitter();

    nodeStatuses: EMeshNodeStatusStrings[] = Object.values(EMeshNodeStatusStrings);
    nodeUtil = NodeUtil;

    constructor(
        private listEffects: ListEffectsService,
        private editorEffects: EditorEffectsService,
        private changeDetectionRef: ChangeDetectorRef
    ) {}

    ngOnInit() {}

    ngAfterViewChecked(): void {
        if (this._contentChanged) {
            this._contentChanged = false;
            this.contentUpdated.emit();
        }
    }

    async publishAllNodes() {
        if (this.beforePublish) {
            await this.beforePublish();
        }
        this.editorEffects.publishNodes(
            this._nodes.filter((node: MeshNode) => {
                return !this.nodeUtil.allLanguagesPublished(node);
            })
        );
    }

    async publishAllNodesLanguage() {
        if (this.beforePublish) {
            await this.beforePublish();
        }
        this.editorEffects.publishNodesLanguage(
            this._nodesCurrentLanguage.filter((node: MeshNode) => {
                return !this.nodeUtil.currentLanguagePublished(node);
            })
        );
    }

    async unpublishAllNodes() {
        this.editorEffects.unpublishNodes(
            this._nodes.filter((node: MeshNode) => {
                return !this.nodeUtil.allLanguagesUnpublished(node);
            })
        );
    }

    async unpublishAllNodesLanguage() {
        this.editorEffects.unpublishNodesLanguage(
            this._nodesCurrentLanguage.filter((node: MeshNode) => {
                return !this.nodeUtil.currentLanguageUnpublished(node);
            })
        );
    }

    markPublishInformationForRefresh(): void {
        this._status = 'loading';
        this._publishInformationNeedsToBeRefreshed = true;
        this._contentChanged = true;
        this.changeDetectionRef.markForCheck();
        this.tryToLoadPublishInformationForAllChildren();
    }

    private tryToLoadPublishInformationForAllChildren(): void {
        // keep variables available for the time after async call completed
        const language = this._language;
        const nodeStatusesToBeConsidered = this._nodeStatusesToBeConsidered;
        if (
            this._publishInformationNeedsToBeRefreshed &&
            !!this._projectName &&
            !!this._containerUuid &&
            !!language &&
            !!nodeStatusesToBeConsidered
        ) {
            this._publishInformationNeedsToBeRefreshed = false;
            this.listEffects
                .loadPublishInformationForAllChildren(this._projectName, this._containerUuid, language)
                .then(
                    (responseData: NodeListResponse) => {
                        const nodesFilteredByStatus: MeshNode[] = responseData.data.filter((node: NodeResponse) => {
                            const nodeStatus: EMeshNodeStatusStrings | null = this.nodeUtil.getNodeStatus(
                                node,
                                language
                            );
                            if (!!nodeStatus) {
                                return nodeStatusesToBeConsidered.includes(nodeStatus);
                            }
                            /**
                             * Fallback like in container-contents.component.html. This allows also considering child nodes
                             * that do not have a translation for the current language, in case all statuses (i.e. 'all') should be considered.
                             */
                            return nodeStatusesToBeConsidered.length >= this.nodeStatuses.length;
                        });
                        this._nodesCurrentLanguage = nodesFilteredByStatus.filter(
                            (node: NodeResponse) => node.language === language
                        );
                        this._nodes = nodesFilteredByStatus;
                        this._status = 'loaded';
                        this._contentChanged = true;
                        this.changeDetectionRef.markForCheck();
                    },
                    () => {
                        this._status = 'error';
                        this._contentChanged = true;
                        this.changeDetectionRef.markForCheck();
                    }
                );
        }
    }
}
