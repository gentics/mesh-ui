import { Project } from '../../common/models/project.model';
import { MeshNode } from '../../common/models/node.model';
import { User } from '../../common/models/user.model';
import { Schema } from '../../common/models/schema.model';

export interface EntityState {
    project: { [uuid: string]: Project };
    node: { [uuid: string]: MeshNode };
    user: { [uuid: string]: User };
    schema: { [uuid: string]: Schema };
}
