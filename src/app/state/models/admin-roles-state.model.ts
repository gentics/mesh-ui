import { AdminRoleResponse } from '../../admin/providers/effects/admin-role-effects.service';

export interface AdminRolesState {
    roleDetail: AdminRoleResponse | null;
}
