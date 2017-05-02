import { Project } from '../../common/models/project.model';
import { MeshNode } from '../../common/models/node.model';
import { User } from '../../common/models/user.model';

export interface EntityState {
    project: { [uuid: string]: Project };
    node: { [uuid: string]: MeshNode };
    user: { [uuid: string]: User };
}
