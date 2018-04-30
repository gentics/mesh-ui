import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ContentPortalService } from '../../../core/providers/content-portal/content-portal.service';

const DEFAULT_PORTAL_ID = '__default_portal__';

/**
 * A portal into which content can be projected using the {@link ProjectContentDirective} (see directive source for
 * example of usage).
 */
@Component({
    selector: 'mesh-content-portal',
    templateUrl: 'content-portal.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class ContentPortalComponent implements OnInit, OnDestroy {

    @Input() id: string = DEFAULT_PORTAL_ID;

    get templates(): TemplateRef<any>[] {
        return this.contentPortalService.getTemplates(this.id);
    }

    constructor(private contentPortalService: ContentPortalService) {}

    ngOnInit(): void {
        this.contentPortalService.registerPortal(this.id);
    }

    ngOnDestroy(): void {
        this.contentPortalService.unregisterPortal(this.id);
    }
}
