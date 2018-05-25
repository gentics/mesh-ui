import { Directive, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { ContentPortalService } from '../../core/providers/content-portal/content-portal.service';

/**
 * This directive is used to project its content into a corresponding instance of the {@link ContentPortalComponent}
 * with a matching id.
 *
 * @example
 * <!-- location A -->
 * <mesh-content-portal id="foobar"></mesh-content-portal>
 *
 * <!-- location B -->
 * <div *meshProjectTo="'foobar'">Project this into location A!</div>
 */
@Directive({ selector: '[meshProjectTo]' })
export class ProjectContentDirective implements OnInit, OnDestroy {
    // tslint:disable-next-line:no-input-rename
    @Input('meshProjectTo') portalId: string;

    constructor(private contentPortalService: ContentPortalService, private templateRef: TemplateRef<any>) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.contentPortalService.addTemplateRef(this.portalId, this.templateRef);
        });
    }

    ngOnDestroy(): void {
        this.contentPortalService.removeTemplateRef(this.portalId, this.templateRef);
    }
}
