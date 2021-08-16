import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeshNode } from '../../../common/models/node.model';
import { PublishStatusModelFromServer } from '../../../common/models/server-models';
import { getNodeStatus } from '../../../common/util/node-util';
import { UILanguage } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'mesh-node-status',
    templateUrl: './node-status.component.html',
    styleUrls: ['./node-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('animNgIfation', [
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
        },
        zh: {
            date: 'yyyy-MM-dd',
            time: 'HH:mm:ss'
        },
        pt: {
            date: 'dd-MM-yyyy',
            time: 'HH:mm:ss'
        },
        hu: {
            date: 'yyyy.MM.dd.',
            time: 'HH:mm:ss'
        }
    };

    // Format date string for date pipe
    dateFormat: string;

    // Format time string for date pipe
    timeFormat: string;

    // enum of node status strings for use in template
    nodeStatusStringsEnum: typeof EMeshNodeStatusStrings = EMeshNodeStatusStrings;

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
        return this.currentUiLanguage$.pipe(
            map((currentUiLanguage: UILanguage) => {
                return this.dateTimeFormat[currentUiLanguage];
            })
        );
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
        const nodeStatus: EMeshNodeStatusStrings | null = getNodeStatus(this.node, this.current);
        if (nodeStatus === null) {
            return;
        }

        // get node status information
        const nodeStatusInformation: PublishStatusModelFromServer = this.node.availableLanguages[this.current];

        // set properties
        this.nodeIsPublished = nodeStatusInformation.published;
        this.nodePublishDate = nodeStatusInformation.publishDate;
        this.nodeEditedDate = this.node.edited;

        if (nodeStatus !== null) {
            this.nodeLabel = nodeStatus;
            this.cssClass = nodeStatus;
        }
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
