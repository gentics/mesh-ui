import { AdminRoleOnlyResponse } from '../../admin/providers/effects/admin-role-effects.service';

export interface AdminRolesState {
    roleDetail: AdminRoleOnlyResponse | null;
}
