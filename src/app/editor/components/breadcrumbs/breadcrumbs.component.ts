import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';

import { MeshNode } from '../../../common/models/node.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';

@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.scss']
})
export class BreadcrumbsComponent {
    routerLinks$: Observable<IBreadcrumbRouterLink[]>;

    constructor(private state: ApplicationStateService,
                private navigationService: NavigationService) {
        this.routerLinks$ = state.select(state => state.editor.openNode)
            .switchMap(node => {
                if (node) {
                    return state.select(state => state.entities.node[node.uuid]);
                } else {
                    return Observable.of(undefined);
                }
            })
            .map(node => this.toRouterLinks(node));
    }

    /**
     * Turns a node to breadcrumb router links, which are used for the gtx-breadcrumbs directive.
     * @param node A node in mesh containing the breadcrumb information.
     */
    private toRouterLinks(node: MeshNode | undefined): IBreadcrumbRouterLink[] {
        if (!node) {
            return [];
        }
        const projectName = this.state.now.editor.openNode.projectName;
        return node.breadcrumb.map(ascendant => ({
            route: this.navigationService.list(projectName, ascendant.uuid).commands(),
            text: ascendant.displayName
        }));
    }
}
