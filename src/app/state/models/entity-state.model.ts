import { Project } from './Mesh/project.model';

export interface EntityState {
    projects: { [uuid: string]: Project };
}
