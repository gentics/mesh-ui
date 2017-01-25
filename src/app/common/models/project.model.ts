import { BaseProperties } from './common.model';

export interface Project extends BaseProperties {
    name: string;
    rootNodeUuid: string;
}
