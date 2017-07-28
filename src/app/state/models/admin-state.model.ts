import { EntityState } from './entity-state.model';

export interface AdminStateEntity {
    type: keyof EntityState;
    uuid: string;
}

export interface AdminState {
    loadCount: number;
    openEntity?: AdminStateEntity;
}
