import { NodeReference, ProjectReference } from '../../common/models/common.model';

export interface ListState {
    currentProject: string | undefined;
    currentNode: string | undefined;
    loadCount: number;
}
