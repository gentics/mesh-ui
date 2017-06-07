import { MeshNode } from '../../common/models/node.model';
import { ProjectResponse, SchemaResponse, UserResponse } from '../../common/models/server-models';

export interface EntityState {
    project: { [uuid: string]: ProjectResponse };
    node: { [uuid: string]: MeshNode };
    user: { [uuid: string]: UserResponse };
    schema: { [uuid: string]: SchemaResponse };
}
