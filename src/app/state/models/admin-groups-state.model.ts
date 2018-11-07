import { AdminGroupOnlyResponse } from '../../admin/providers/effects/admin-group-effects.service';

export interface AdminGroupsState {
    groupDetail: AdminGroupOnlyResponse | null;
}
