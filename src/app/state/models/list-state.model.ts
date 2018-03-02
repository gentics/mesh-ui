import { MeshNode } from "../../common/models/node.model";
import { Tag } from "../../common/models/tag.model";

export interface ListState {
    currentProject: string | undefined;
    currentNode: string | undefined;
    loadCount: number;
    language: string;
    children: string[];
    filterTerm: string;
}
