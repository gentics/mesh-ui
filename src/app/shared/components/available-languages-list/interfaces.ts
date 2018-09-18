import { PublishStatusModelFromServer } from '../../../common/models/server-models';

export interface PublishModelMap {
    [key: string]: PublishStatusModelFromServer;
}

export type Language = string;
