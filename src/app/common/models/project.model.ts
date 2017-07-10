import { BaseProperties, NodeReference } from './common.model';

export interface Project extends BaseProperties {
    name: string;
    rootNode: NodeReference;
}
