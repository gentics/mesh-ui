import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';

import { MeshNode } from '../../../common/models/node.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { Project } from '../../../common/models/project.model';

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
        const project = this.getProjectByName(currentProject);
        if (!currentProject || !project) {
            return [];
        }
        const rootNodeLink: IBreadcrumbRouterLink = {
            route: this.navigationService.list(project.name, project.rootNode.uuid).commands(),
            text: project.name
        };
        if (!node) {
            return [rootNodeLink];
        }
        const selfName = node.displayField ? node.fields[node.displayField] : node.uuid;
        const selfLink: IBreadcrumbRouterLink = {
            route: this.navigationService.list(project.name, node.uuid).commands(),
            text: selfName
        };
        const breadcrumbs = node.breadcrumb.map(ascendant => ({
            route: this.navigationService.list(project.name, ascendant.uuid).commands(),
            text: ascendant.displayName!
        }));

        // TODO: currently Mesh returns the breadcrumbs reversed, but this behaviour will change in
        // the future. At that time, this line may be removed.
        breadcrumbs.reverse();

        return [rootNodeLink, ...breadcrumbs, selfLink];
    }

    private getProjectByName(projectName: string | undefined): Project | undefined {
        if (!projectName) {
            return;
        }
        const projects = this.state.now.entities.project;
        const match = Object.keys(projects)
            .map(uuid => projects[uuid])
            .find(project => project.name === projectName);
        return match;
    }
}
