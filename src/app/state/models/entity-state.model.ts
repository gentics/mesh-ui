import { Project } from '../../common/models/project.model';
import { MeshNode } from '../../common/models/node.model';
import { User } from '../../common/models/user.model';
import { Schema } from '../../common/models/schema.model';
import { UserResponse, ProjectResponse, SchemaResponse } from '../../common/models/server-models';

export interface EntityState {
    project: { [uuid: string]: ProjectResponse };
    node: { [uuid: string]: MeshNode };
    user: { [uuid: string]: UserResponse };
    schema: { [uuid: string]: SchemaResponse };
}
