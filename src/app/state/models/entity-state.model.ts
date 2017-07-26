import { MeshNode } from '../../common/models/node.model';

export interface EntityState {
    project: { [uuid: string]: any };
    node: { [uuid: string]: MeshNode };
    user: { [uuid: string]: any };
    schema: { [uuid: string]: any };
    microschema: { [uuid: string]: any };
    // TODO -----------------------------------------------
    // project: { [uuid: string]: Project };
    // node: { [uuid: string]: MeshNode };
    // user: { [uuid: string]: User };
    // schema: { [uuid: string]: Schema };
    // microschema: { [uuid: string]: Microschema };
}
