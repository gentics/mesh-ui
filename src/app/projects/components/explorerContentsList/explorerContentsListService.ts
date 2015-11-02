module meshAdminUi {

    /**
     * This service allows communication between the various parts of the explorer contents list. Specifically it
     * stores which list items are currently selected.
     */
    export class ExplorerContentsListService {

        public totalItems: number = 0;
        public itemsPerPage: number = 0;
        public selectedItems: string[] = [];
        private _areAllSelected: boolean = false;

        constructor() {
        }

        /**
         * Toggle whether the items at index is selected.
         */
        public toggleSelect(uuid: string) {
            if (this.isSelected(uuid)) {
                var idx = this.selectedItems.indexOf(uuid);
                this.selectedItems.splice(idx, 1);
            } else {
                this.selectedItems.push(uuid);
            }
            this._areAllSelected = this.areAllSelected();
        }

        /**
         * Is the item at index currently selected?
         */
        public isSelected(uuid: string): boolean {
            return -1 < this.selectedItems.indexOf(uuid);
        }

        public getSelection(): string[] {
            return this.selectedItems;
        }

        public clearSelection() {
            return this.selectedItems = [];
        }

        /**
         * Are all items selected?
         */
        public areAllSelected(): boolean {
            return this.selectedItems.length === this.itemsPerPage;
        }

    }

    angular.module('meshAdminUi.projects')
        .service('explorerContentsListService', ExplorerContentsListService);
}