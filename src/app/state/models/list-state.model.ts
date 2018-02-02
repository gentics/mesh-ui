import { MeshNode } from "../../common/models/node.model";

export interface ListState {
    currentProject: string | undefined;
    currentNode: string | undefined;
    loadCount: number;
    language: string;
    children: string[];
    filter: string;
    searchResults?: MeshNode[];
}
