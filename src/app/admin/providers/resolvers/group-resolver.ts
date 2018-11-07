import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { BreadcrumbTextFunction } from '../../components/admin-breadcrumbs/admin-breadcrumbs.component';
import { AdminGroupEffectsService, AdminGroupOnlyResponse } from '../effects/admin-group-effects.service';

@Injectable()
export class GroupResolver implements Resolve<AdminGroupOnlyResponse | undefined> {
    constructor(private adminGroupEffects: AdminGroupEffectsService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<AdminGroupOnlyResponse> | undefined {
        const uuid = route.paramMap.get('uuid');

        if (uuid && uuid !== 'new') {
            return this.adminGroupEffects.loadGroup(uuid).toPromise();
        }
    }
}

export const groupBreadcrumbFn: BreadcrumbTextFunction = (route, state, entities) => {
    const group = state.adminGroups.groupDetail;
    if (group) {
        return group.name;
    } else {
        return 'admin.new_group';
    }
};
