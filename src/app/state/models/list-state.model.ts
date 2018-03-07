export interface ListState {
    currentProject: string | undefined;
    currentNode: string | undefined;
    loadCount: number;
    language: string;
    items: string[];
    filterTerm: string;
}
