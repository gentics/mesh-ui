import { Component } from '@angular/core';
import { IBreadcrumbRouterLink } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';

import { MeshNode } from '../../../common/models/node.model';
import { Project } from '../../../common/models/project.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    selector: 'mesh-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.scss']
})
export class BreadcrumbsComponent {
    routerLinks$: Observable<IBreadcrumbRouterLink[]>;

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private navigationService: NavigationService
    ) {
        this.routerLinks$ = state.select(state => state.list).map(({ currentNode, language }) => {
            let node: MeshNode | undefined;
            if (currentNode) {
                node = entities.getNode(currentNode, { language, strictLanguageMatch: false });
            }
            return this.toRouterLinks(node, language);
        });
    }

    /**
     * Turns a node to breadcrumb router links, which are used for the gtx-breadcrumbs directive.
     */
    private toRouterLinks(node: MeshNode | undefined, language: string): IBreadcrumbRouterLink[] {
        const currentProject = this.state.now.list.currentProject;
        const project = this.getProjectByName(currentProject);
        if (!currentProject || !project) {
            return [];
        }

        const rootNodeLink: IBreadcrumbRouterLink = {
            route: this.navigationService.list(project.name, project.rootNode.uuid, language).commands(),
            text: project.name
        };

        if (!node) {
            return [rootNodeLink];
        }

        // Remove the first element (root node), we are showing the project name instead
        const breadcrumbs = node.breadcrumb.slice(1).map(ascendant => ({
            route: this.navigationService.list(project.name, ascendant.uuid, language).commands(),
            text: ascendant.displayName || ascendant.uuid
        }));

        return [rootNodeLink, ...breadcrumbs];
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
