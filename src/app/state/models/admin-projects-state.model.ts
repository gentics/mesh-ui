export interface AdminProjectsState {
    loadCount: number;
    projectList: string[];
    projectDetail: string | null;
    filterTerm: string;
    filterTagsTerm: string;
    filterTermSchemas: string;
    filterTermMicroschema: string;
}
