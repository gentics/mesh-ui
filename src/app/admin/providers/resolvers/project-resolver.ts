import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map } from 'rxjs/operators';

import { Project } from '../../../common/models/project.model';
import { BreadcrumbTextFunction } from '../../components/admin-breadcrumbs/admin-breadcrumbs.component';
import { AdminProjectEffectsService } from '../effects/admin-project-effects.service';

@Injectable()
export class ProjectResolver implements Resolve<Project> {
    constructor(private adminProjectEffects: AdminProjectEffectsService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<Project> {
        const uuid = route.paramMap.get('uuid');
        if (!uuid) {
            throw new Error(`Could not find a project with the uuid "${uuid}"`);
        }

        return this.adminProjectEffects.openProject(uuid).then(project => {
            if (!project) {
                // throw
                throw new Error(`Could not find a project with the uuid "${uuid}"`);
            }
            return project!;
        });
    }
}

export const projectBreadcrumbFn: BreadcrumbTextFunction = (route, state, entities, i18n) => {
    const uuid = state.adminProjects.projectDetail;
    if (!uuid) {
        return i18n.translate('admin.new_project');
    } else {
        return entities.selectProject(uuid).pipe(
            map(project => {
                return `${project.name}`;
            })
        );
    }
};
