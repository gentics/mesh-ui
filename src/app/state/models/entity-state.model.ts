import { MeshNode } from '../../common/models/node.model';
import { User } from '../../common/models/user.model';
import { Schema } from '../../common/models/schema.model';
import { Microschema } from '../../common/models/microschema.model';
import { Project } from '../../common/models/project.model';
import { TagFamily } from '../../common/models/tag-family.model';
import { Tag } from '../../common/models/tag.model';
import { Group } from '../../common/models/group.model';

export interface EntityState {
    group: {
        [uuid: string]: Group
    };
    microschema: {
        [uuid: string]: {
            [version: string]: Microschema;
        };
    };
    node: {
        [uuid: string]: {
            [lang: string]: {
                [version: string]: MeshNode;
            };
        };
    };
    project: {
        [uuid: string]: Project
    };
    schema: {
        [uuid: string]: {
            [version: string]: Schema;
        };
    };
    tagFamily: {
        [uuid: string]: TagFamily;
    };
    tag: {
        [uuid: string]: Tag;
    };
    user: {
        [uuid: string]: User;
    };
}
