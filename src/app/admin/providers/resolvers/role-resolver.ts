import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { BreadcrumbTextFunction } from '../../components/admin-breadcrumbs/admin-breadcrumbs.component';
import { AdminRoleEffectsService, AdminRoleResponse } from '../effects/admin-role-effects.service';

@Injectable()
export class RoleResolver implements Resolve<AdminRoleResponse | undefined> {
    constructor(private adminRoleEffects: AdminRoleEffectsService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<AdminRoleResponse> | undefined {
        const uuid = route.paramMap.get('uuid');

        if (uuid && uuid !== 'new') {
            return this.adminRoleEffects.loadRole(uuid).toPromise();
        }
    }
}

export const roleBreadcrumbFn: BreadcrumbTextFunction = (route, state, entities) => {
    const role = state.adminRoles.roleDetail;
    if (role) {
        return role.name;
    } else {
        return 'admin.new_role';
    }
};
