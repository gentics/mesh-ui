import { BaseProperties, GroupReference, NodeReference } from './common.model';

export interface User extends BaseProperties {
    lastname?: string;
    firstname?: string;
    username: string;
    emailAddress?: string;
    nodeReference?: NodeReference;
    enabled: boolean;
    groups: GroupReference[];
}
