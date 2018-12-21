import {
    animate,
    style,
    transition,
    trigger,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnDestroy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MeshNode } from '../../../common/models/node.model';
import { PublishStatusModelFromServer } from '../../../common/models/server-models';
import { UILanguage } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'mesh-node-status',
    templateUrl: './node-status.component.html',
    styleUrls: ['./node-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('statusAnimation', [
            transition(':enter', [style({ opacity: 0 }), animate('0.09s', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('0.09s', style({ opacity: 0 }))])
        ])
    ]
})
export class NodeStatusComponent implements OnChanges, OnDestroy {
    /** Node the status tag is indicating */
    @Input() node: MeshNode;

    /** Current node language */
    @Input() current: string;

    /** Displayed node title */
    nodeLabel: string;

    /** Published state of node depending on language */
    nodeIsPublished: boolean;

    /** Current UI language */
    currentUiLanguage$: Observable<UILanguage>;

    /** Current node language */
    currentNodeLanguage$: Observable<string>;

    /** Date the node has been published depending on language */
    nodePublishDate: string | undefined;

    /** Date the node has been edited */
    nodeEditedDate: string | undefined;

    /** Span css class indicating status */
    cssClass: string;

    /** True if mouse hover over div.status */
    hasHover = new BehaviorSubject<boolean>(false);

    /** Date format string */
    dateTimeFormat: {
        [key in UILanguage]: {
            date: string;
            time: string;
        }
    } = {
        en: {
            date: 'yyyy-MM-dd',
            time: 'HH:mm:ss'
        },
        de: {
            date: 'dd.MM.yyyy',
            time: 'HH:mm:ss'
        }
    };

    // Format date string for date pipe
    dateFormat: string;

    // Format time string for date pipe
    timeFormat: string;

    /** Component lifecycle indicator */
    private destroy$ = new Subject<void>();

    // CONSTRUCTOR
    constructor(private state: ApplicationStateService) {
        // get current UI language from state
        this.currentUiLanguage$ = this.state.select(state => state.ui.currentLanguage);
    }

    // ONCHANGES
    ngOnChanges(): void {
        this.setNodeStatus();
    }

    // ONDESTROY
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getDateTimeFormat(): Observable<{
        date: string;
        time: string;
    }> {
        return this.currentUiLanguage$.map((currentUiLanguage: UILanguage) => {
            return this.dateTimeFormat[currentUiLanguage];
        });
    }

    onMouseenter(): void {
        this.hasHover.next(true);
    }

    onMouseleave() {
        setTimeout(() => {
            this.hasHover.next(false);
        }, 300);
    }

    getNodeHasStatus(): boolean {
        return !!this.node.availableLanguages && !!this.node.availableLanguages[this.current];
    }

    getNodeHasBeenEdited(): boolean {
        return this.getNodeVersionParsed().versionMinor > 0;
    }

    setNodeStatus(): void {
        if (!this.getNodeHasStatus()) {
            return;
        }

        // get node status information
        const nodeStatus: PublishStatusModelFromServer = this.node.availableLanguages[this.current];
        let nodeLabel = '';
        let cssClass = '';

        // set properties
        this.nodeIsPublished = nodeStatus.published;
        this.nodePublishDate = nodeStatus.publishDate;
        this.nodeEditedDate = this.node.edited;

        if (!this.nodeIsPublished && this.getNodeHasBeenEdited()) {
            nodeLabel = EMeshNodeStatusStrings.DRAFT;
            cssClass = EMeshNodeStatusStrings.DRAFT;
            // PUBLISHED
        } else if (this.nodeIsPublished && !this.getNodeHasBeenEdited()) {
            nodeLabel = EMeshNodeStatusStrings.PUBLISHED;
            cssClass = EMeshNodeStatusStrings.PUBLISHED;

            // UPDATED
        } else if (this.nodeIsPublished && this.getNodeHasBeenEdited()) {
            nodeLabel = EMeshNodeStatusStrings.UPDATED;
            cssClass = EMeshNodeStatusStrings.UPDATED;

            // ARCHIVED
        } else if (!this.nodeIsPublished && !this.getNodeHasBeenEdited()) {
            nodeLabel = EMeshNodeStatusStrings.ARCHIVED;
            cssClass = EMeshNodeStatusStrings.ARCHIVED;
        }

        this.nodeLabel = nodeLabel;
        this.cssClass = cssClass;
    }

    private getNodeVersionParsed() {
        return {
            versionMajor: parseInt(this.node.version.split('.')[0], 10),
            versionMinor: parseInt(this.node.version.split('.')[1], 10)
        };
    }
}

// possible node states
export enum EMeshNodeStatusStrings {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    UPDATED = 'updated',
    ARCHIVED = 'archived'
}
