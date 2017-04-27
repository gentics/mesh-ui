import { Project } from '../../common/models/project.model';

export interface EntityState {
    project: { [uuid: string]: Project };
}
