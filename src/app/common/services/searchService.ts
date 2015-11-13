module meshAdminUi {

    export interface INodeSearchParams {
        searchTerm?: string;
        tagFilters?: ITag[];
        searchAll?: boolean;
    }

    /**
     * Service to keep a track of the currently-applied search settings
     */
    export class SearchService {

        public searchTerm: string = '';
        public tagFilters: ITag[] = [];
        public searchAll: boolean = false;


        public setParams(params: INodeSearchParams) {
            if (params.hasOwnProperty('searchTerm')) {
                this.searchTerm = params.searchTerm;
            }
            if (params.tagFilters) {
                this.tagFilters = params.tagFilters;
            }
            if (params.hasOwnProperty('searchAll')) {
                this.searchAll = params.searchAll;
            }
        }

        public getParams(): INodeSearchParams {
            return {
                searchTerm: this.searchTerm,
                tagFilters: this.tagFilters,
                searchAll: this.searchAll
            };
        }
    }

    angular.module('meshAdminUi.common')
        .service('searchService', SearchService);
}