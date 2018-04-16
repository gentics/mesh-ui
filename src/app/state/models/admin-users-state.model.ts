import { PaginationConfig } from './common-state-models';

export interface AdminUsersState {
    loadCount: number;
    userList: string[];
    userDetail: string | null;
    pagination: PaginationConfig;
}

