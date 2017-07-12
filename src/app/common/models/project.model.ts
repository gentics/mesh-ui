import { BaseProperties, NodeReference } from './common.model';
import { Schema } from './schema.model';

export interface Project extends BaseProperties {
    name: string;
    rootNode: NodeReference;

    // TODO: move to distinct interface
    schemas?: Schema[];
}
