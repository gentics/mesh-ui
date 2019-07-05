import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router } from '@angular/router';
import { Notification } from 'gentics-ui-core';
import { of, Observable } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { ProjectResponse } from '../../../common/models/server-models';
import { ApiService } from '../api/api.service';
import { NavigationService } from '../navigation/navigation.service';

/**
 * @description If there exist no projects in this Mesh instance at all this component will be displayed.
 */
@Injectable({
    providedIn: 'root'
})
export class AssureEntitiesGuard implements CanActivateChild {
    constructor(
        private api: ApiService,
        private router: Router,
        private navigationService: NavigationService,
        private notification: Notification
    ) {}

    async canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> {
        const currentProjectName = route.params.projectName;
        const currentContainerUuid = route.params.containerUuid;
        const command = route.params.command;
        console.log('!!!!!!!!!!!!!!!!!!!!! route.params:', route.params);

        return this.api.project
            .getProjects({})
            .pipe(
                map((response: any) => response.data),
                mergeMap((projects: ProjectResponse[]) => {
                    const allProjects = projects;
                    const noProjects = allProjects.length === 0;
                    const projectExists =
                        allProjects.filter(project => {
                            return project.name === currentProjectName;
                        }).length > 0;
                    console.log('!!! allProjects:', allProjects);
                    console.log('!!! currentProjectName:', currentProjectName);
                    console.log('!!! currentContainerUuid:', currentContainerUuid);

                    // redirect to introduction page if requested project doesn't exist
                    if (noProjects) {
                        console.log('!!! cond - 01 !!!');
                        this.router.navigate(['/editor', 'empty']);
                        return of(false);

                        // if projects exist but not the one in the route, redirect to next available project and notify user
                    } else if (!projectExists) {
                        console.log('!!! cond - 02 !!!');
                        const projectFallbackName = allProjects[0].name;
                        return this.getProjectRootContainerUuid(projectFallbackName).pipe(
                            map(rootContainerUuid => {
                                // notify user
                                this.notification.show({
                                    type: 'error',
                                    message: `Project ${currentProjectName} does not exist.`
                                });
                                console.log('!!!!!!!!!!!!!!!!!! projectFallbackName:', projectFallbackName);
                                // try to navigate to next available project contents
                                this.navigationService
                                    .list(projectFallbackName, rootContainerUuid)
                                    .navigate(route.params);
                                return false;
                            })
                        );

                        // if project in route exists check if container node exists
                    } else {
                        console.log('!!! cond - 03 !!!');
                        // if route indicates writing instead of reading, no need to check
                        if (typeof command === 'string') {
                            console.log('!!! cond - 04 !!!');
                            return of(true);
                        } else {
                            console.log('!!! cond - 05 !!!');
                            return this.nodeExists(currentProjectName, currentContainerUuid).pipe(
                                mergeMap(nodeExists => {
                                    console.log('!!! cond - 06 !!!');
                                    // if container node in route exists allow navigation and do nothing
                                    if (nodeExists) {
                                        console.log('!!! cond - 07 !!!');
                                        return of(true);
                                    } else {
                                        console.log('!!! cond - 08 !!!');
                                        // try to navigate to root container instead
                                        return this.getProjectRootContainerUuid(currentProjectName).pipe(
                                            map(rootContainerUuid => {
                                                // try to navigate to next available project contents
                                                this.navigationService
                                                    .list(currentProjectName, rootContainerUuid)
                                                    .navigate(route.params);
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
    private nodeExists(projectname: string, nodeUuid: string): Observable<boolean> {
        if (nodeUuid.length < 12) {
            return of(false);
        }
        return this.api.project
            .getNode({
                project: projectname,
                nodeUuid
            })
            .pipe(
                tap(result => console.log('!!! nodeExists result:', result)),
                map(node => (node ? true : false)),
                catchError(() => of(false))
            );
    }

    /**
     * @returns UUID of the root container node of the project
     */
    private getProjectRootContainerUuid(projectName: string): Observable<string> {
        return this.api.project
            .getProjectByName({ project: projectName })
            .pipe(switchMap((project: ProjectResponse) => project.rootNode.uuid));
    }
}
