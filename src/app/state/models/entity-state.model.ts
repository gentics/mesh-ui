import { MeshNode } from '../../common/models/node.model';
import { Project } from '../../common/models/project.model';
import { Schema } from '../../common/models/schema.model';
import { User } from '../../common/models/user.model';

export interface EntityState {
    project: { [uuid: string]: any };
    node: { [uuid: string]: MeshNode };
    user: { [uuid: string]: any };
    schema: { [uuid: string]: any };
    // TODO -----------------------------------------------
    // project: { [uuid: string]: Project };
    // node: { [uuid: string]: MeshNode };
    // user: { [uuid: string]: User };
    // schema: { [uuid: string]: Schema };
}
