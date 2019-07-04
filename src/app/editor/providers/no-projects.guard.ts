import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';

import { Project } from '../../common/models/project.model';
import { ProjectResponse } from '../../common/models/server-models';

import { ApiService } from '../../core/providers/api/api.service';
import { ApplicationStateService } from '../../state/providers/application-state.service';

/**
 * @description If there exist no projects in this Mesh instance at all this component will be displayed.
 */
@Injectable({
    providedIn: 'root'
})
export class NoProjectsGuard implements CanActivateChild {
    path: ActivatedRouteSnapshot[];
    readonly route: ActivatedRouteSnapshot;

    projects: Project[] = [];
    currentProject: any;

    constructor(private api: ApiService, private state: ApplicationStateService, private router: Router) {
        this.api.project
            .getProjects({})
            .pipe(map((response: any) => response.data))
            .subscribe((projects: ProjectResponse[]) => {
                this.projects = projects;
            });

        this.state
            .select(state => state.list.currentProject)
            .subscribe((currentProject: string) => {
                this.currentProject = currentProject;
            });
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const projectUrlSegment = route.url[0].path;

        console.log('!!! NoProjectsGuard.projects:', this.projects);
        console.log('!!! currentProject:', this.currentProject);
        console.log('!!! projectUrlSegment:', projectUrlSegment);
        // redirect to introduction page if requested project doesn't exist
        // this.router.navigate(['/editor', 'empty']);
        return true;
    }
}
