import { Project } from '../../common/models/project.model';

export interface EntityState {
    projects: { [uuid: string]: Project };
}
