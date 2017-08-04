import { EntityState } from './entity-state.model';

export interface AdminStateEntity {
    type: keyof EntityState;
    uuid?: string;
    isNew: boolean;
}

export interface ProjectAssignments {
    [projectUuid: string]: boolean;
}

export interface AdminState {
    loadCount: number;
    openEntity?: AdminStateEntity;
    /** Assignment of the currently open (micro-)schema to projects. */
    assignedToProject: ProjectAssignments;
    displayedProjects: string[];
    displayedSchemas: string[];
    displayedMicroschemas: string[];
}
