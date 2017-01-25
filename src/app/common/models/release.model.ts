import { BaseProperties } from './common.model';

export interface Release extends BaseProperties {
    name: string;
    migrated: boolean;
}
