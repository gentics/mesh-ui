import { MeshNode } from '../../common/models/node.model';
import { User } from '../../common/models/user.model';
import { Schema } from '../../common/models/schema.model';
import { Microschema } from '../../common/models/microschema.model';
import { Project } from '../../common/models/project.model';

export interface EntityState {
    project: {
        [uuid: string]: Project
    };
    node: {
        [uuid: string]: {
            [lang: string]: {
                [version: string]: MeshNode;
            };
        };
    };
    user: {
        [uuid: string]: User;
    };
    schema: {
        [uuid: string]: {
            [version: string]: Schema;
        };
    };
    microschema: {
        [uuid: string]: {
            [version: string]: Microschema;
        };
    };
}
