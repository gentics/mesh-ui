import { BaseProperties, TagFamilyReference } from './common.model';

export interface Tag extends BaseProperties {
    tagFamily: TagFamilyReference;
    name: string;
}
