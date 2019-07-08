import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Notification } from 'gentics-ui-core';
import { of, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ProjectResponse } from '../../../common/models/server-models';
import { ApiService } from '../api/api.service';
import { NavigationService } from '../navigation/navigation.service';

/**
 * @description If there exist no projects in this Mesh instance at all this component will be displayed.
 */
@Injectable({
    providedIn: 'root'
})
export class AssureEntitiesGuard implements CanActivate, CanActivateChild {
    constructor(
        private api: ApiService,
        private router: Router,
        private navigationService: NavigationService,
        private notification: Notification
    ) {}

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this.canActivateCheck(route);
    }

    async canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this.canActivateCheck(route);
    }

    private async canActivateCheck(route: ActivatedRouteSnapshot): Promise<boolean> {
        const currentProjectName = route.params.projectName;
        const currentContainerUuid = route.params.containerUuid;
        const currentNodeUuid = route.params.nodeUuid;
        const command = route.params.command;

        return this.api.project
            .getProjects({})
            .pipe(
                map((response: any) => response.data),
                mergeMap((projects: ProjectResponse[]) => {
                    /** All project available from Mesh response */
                    const allProjects = projects;
                    /*+ TRUE if there exist no projects at all */
                    const noProjects = allProjects.length === 0;
                    /** TRUE if current project exists in Mesh response */
                    const projectExists =
                        allProjects.filter(project => {
                            return project.name === currentProjectName;
                        }).length > 0;

                    // redirect to introduction page if requested project doesn't exist
                    if (noProjects) {
                        this.router.navigate(['/editor', 'empty']);
                        return of(false);

                        // if projects exist but not the one in the route, redirect to next available project and notify user
                    } else if (!projectExists) {
                        // allow navigation if no params info available to prevent a loop
                        if (!currentProjectName || !currentContainerUuid) {
                            return of(true);
                        }

                        // choose the next available project as a fallback to display
                        const projectFallbackName = allProjects[0].name;
                        return this.getProjectRootContainerUuid(projectFallbackName).pipe(
                            map((rootContainerUuid: string) => {
                                // notify user
                                this.notification.show({
                                    type: 'error',
                                    message: `Project ${currentProjectName} does not exist.`
                                });
                                // try to navigate to next available project contents
                                this.navigationService
                                    .list(projectFallbackName, rootContainerUuid)
                                    .navigate({ queryParams: route.params });
                                return false;
                            })
                        );

                        // if project in route exists check if container node exists
                    } else {
                        // if route indicates writing instead of reading, no need to check
                        if (typeof command === 'string') {
                            return of(true);
                        } else {
                            // if node editor is open with node, there is no currentContainerUuid but a currentNodeUuid
                            let checkNodeUuid: string;
                            if (currentContainerUuid) {
                                checkNodeUuid = currentContainerUuid;
                            } else if (currentNodeUuid) {
                                checkNodeUuid = currentNodeUuid;
                            } else {
                                // if in doubt, allow
                                return of(true);
                            }
                            return this.nodeExists(currentProjectName, checkNodeUuid).pipe(
                                mergeMap(nodeExists => {
                                    // if container node in route exists allow navigation and do nothing
                                    if (nodeExists) {
                                        return of(true);
                                    } else {
                                        // try to navigate to root container instead
                                        return this.getProjectRootContainerUuid(currentProjectName).pipe(
                                            map(rootContainerUuid => {
                                                // try to navigate to next available project contents
                                                this.navigationService
                                                    .list(currentProjectName, rootContainerUuid)
                                                    .navigate({ queryParams: route.params });
                                                return false;
                                            })
                                        );
                                    }
                                })
                            );
                        }
                    }
                })
            )
            .toPromise();
    }

    /**
     * @returns if container is available from backend (true) or not (false)
     */
    private nodeExists(projectName: string, nodeUuid: string): Observable<boolean> {
        return this.api.project
            .getNode({
                project: projectName,
                nodeUuid
            })
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );
    }

    /**
     * @returns UUID of the root container node of the project
     */
    private getProjectRootContainerUuid(projectName: string): Observable<string> {
        return this.api.project
            .getProjectByName({ project: projectName })
            .pipe(map((project: ProjectResponse) => project.rootNode.uuid));
    }
}
