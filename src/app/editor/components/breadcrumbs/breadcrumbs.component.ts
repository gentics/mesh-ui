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
        this.routerLinks$ = state.select(state => {
                return state.list.currentNode &&
                state.entities.node[state.list.currentNode] || undefined; })
            .map(node => this.toRouterLinks(node));
    }

    /**
     * Turns a node to breadcrumb router links, which are used for the gtx-breadcrumbs directive.
     * @param node A node in mesh containing the breadcrumb information.
     */
    private toRouterLinks(node: MeshNode | undefined): IBreadcrumbRouterLink[] {
        const currentProject = this.state.now.list.currentProject;
        const projectName = this.projectNameToUuid(currentProject);
        if (!node || !currentProject || !projectName) {
            return [];
        }


        return node.breadcrumb.map(ascendant => ({
            route: this.navigationService.list(projectName, ascendant.uuid).commands(),
            text: ascendant.displayName!
        }));
    }

    private projectNameToUuid(projectName: string | undefined): string | undefined {
        if (!projectName) {
            return;
        }
        const projects = this.state.now.entities.project;
        const match = Object.keys(projects)
            .map(uuid => projects[uuid])
            .find(project => project.name === projectName);
        return match && match.name;
    }
}
