import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { User } from '../../../common/models/user.model';
import { BreadcrumbTextFunction } from '../../components/admin-breadcrumbs/admin-breadcrumbs.component';
import { AdminUserEffectsService } from '../effects/admin-user-effects.service';

@Injectable()
export class UserResolver implements Resolve<User | undefined> {
    constructor(private adminUserEffects: AdminUserEffectsService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<User> | undefined {
        const uuid = route.paramMap.get('uuid');

        if (uuid === 'new') {
            this.adminUserEffects.newUser();
        } else if (uuid) {
            return this.adminUserEffects.openUser(uuid).then(user => {
                if (!user) {
                    // throw
                    throw new Error(`Could not find a user with the uuid "${uuid}"`);
                }
                return user;
            });
        }
    }
}

export const userBreadcrumbFn: BreadcrumbTextFunction = (route, state, entities) => {
    const userUuid = state.adminUsers.userDetail;
    if (!userUuid) {
        return 'admin.new_user';
    } else {
        return entities.selectUser(userUuid).map(user => {
            if (user.firstname && user.lastname) {
                return `${user.firstname} ${user.lastname} (${user.username})`;
            }
            return `${user.username}`;
        });
    }
};
