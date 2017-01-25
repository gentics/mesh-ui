import { BaseProperties, GroupReference } from './common.model';

export interface Role extends BaseProperties {
    name: string;
    groups: GroupReference[];
}
