import { Injectable } from '@angular/core';
import { RolePermissionRequest } from 'src/app/common/models/server-models';

import { ApiService } from '../../../core/providers/api/api.service';

@Injectable()
export class AdminPermissionEffectsService {
    constructor(private api: ApiService) {}

    public grantPermissionToProject(roleUuid: string, projectUuid: string, permissions: RolePermissionRequest) {
        return this.api.admin
            .setRolePermissions(
                {
                    roleUuid,
                    path: `projects/${projectUuid}`
                },
                permissions
            )
            .toPromise();
    }
}
