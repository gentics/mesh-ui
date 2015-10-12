module meshAdminUi {

    /**
     * Specify the prefix for the app's localStorage entries.
     */
    function localStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('mesh');
    }

    /**
     * Service to track work-in-progress (WIP) items, i.e. objects which have
     * been opened for editing but have not had their changes persisted back
     * to the server. This service allows the user to edit multiple open objects
     * at once, and tracks whether they need to be persisted.
     *
     * In any of these methods that have an `item` requirement, `item` must be an
     * object with a `uuid` property.
     */
    export class WipService {
        private wipStore = {};
        private modifiedWips = {};
        private onWipChangeCallbacks = [];

        constructor(private $q: ng.IQService,
                    private localStorageService,
                    private mu: MeshUtils) {
            this.populateFromLocalStorage();
        }



        /**
         * Generates a temporary unique ID for newly-created items so that
         * they can be referenced before they are saved to the server (at
         * which point they should get a new, server-generated ID).
         */
        public generateTempId(): string {
            return this.mu.generateGuid();
        }

        /**
         * Add a new wip item of specified type to the store.
         * Metadata is an optional argument which can be used to store
         * arbitrary key-value data that can be retrieved later.
         */
        public openItem(type: string, item: any, metadata?: any) {
            this.validateItem(item);
            if (!this.wipStore[type]) {
                this.wipStore[type] = {};
                this.modifiedWips[type] = {};
            }
            if (this.wipStore[type][item.uuid]) {
                throw new Error('wipStore#openItem: "' + type + '" with uuid "' +
                    item.uuid + '" is already open.');
            }
            this.wipStore[type][item.uuid] = {
                item: item,
                metadata: metadata || {}
            };
            this.invokeChangeCallbacks();
        }

        /**
         * Set a key-value pair on the wip item's metadata object.
         */
        public setMetadata(type: string, uuid: string, key: string, value: any) {
            if (this.wipStore[type] && this.wipStore[type][uuid]) {
                this.wipStore[type][uuid].metadata[key] = value;
            }
        }

        /**
         * Get the metadata associated with the wip item.
         */
        public getMetadata(type: string, uuid: string): any {
            this.checkItemInWipStore(type, uuid);
            return this.wipStore[type][uuid].metadata;
        }

        /**
         * Mark the item as having been modified,
         * which determines its behaviour on closing.
         */
        public setAsModified(type: string, item: any) {
            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            this.modifiedWips[type][item.uuid] = true;
            this.invokeChangeCallbacks();
        }

        /**
         * Set the item to be unmodified. Useful in the situation where a modified item
         * is persisted to the server, but we want to keep it open in the wipStore but
         * indicate that it is unmodified and okay to close.
         */
        public setAsUnmodified(type: string, item: any) {
            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            this.modifiedWips[type][item.uuid] = false;
            this.invokeChangeCallbacks();
        }

        /**
         * Checks to see if the item in the store has been modified.
         */
        public isModified(type: string, item: any): boolean {
            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            return this.modifiedWips[type][item.uuid] === true;
        }

        /**
         * Remove an existing item of the specified type from the store.
         */
        public closeItem(type: string, item: any): ng.IPromise<any> {
            var deferred = this.$q.defer();

            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            delete this.wipStore[type][item.uuid];
            delete this.modifiedWips[type][item.uuid];
            this.invokeChangeCallbacks(() => deferred.resolve(item));
            return deferred.promise;
        }

        /**
         * Get an array of all open items of the specified type.
         */
        public getOpenItems(type: string): any[] {
            var itemsArray = [];

            if (this.wipStore[type]) {
                for (var key in this.wipStore[type]) {
                    if (this.wipStore[type].hasOwnProperty(key)) {
                        itemsArray.push(this.wipStore[type][key]);
                    }
                }
            }
            return itemsArray;
        }

        /**
         * Get an array of uuids of each item of the specified type which has been modified.
         */
        public getModifiedItems(type: string): any[] {
            var itemsArray = [];

            if (this.modifiedWips[type]) {
                for (var key in this.modifiedWips[type]) {
                    if (this.modifiedWips[type].hasOwnProperty(key) && this.modifiedWips[type][key] === true) {
                        itemsArray.push(key);
                    }
                }
            }
            return itemsArray;
        }

        /**
         * Returns the wip content specified by the uuid if it exists in the contents store.
         *
         * @param {String} type
         * @param {String} uuid
         * @returns {*}
         */
        public getItem(type: string, uuid: string): any {
            return this.wipStore[type] && this.wipStore[type][uuid] && this.wipStore[type][uuid].item;
        }

        /**
         * Register a callback function which will be invoked every time there is a change to
         * the status of wip items (i.e. whenever a new wip item is opened, or an existing one
         * is closed).
         */
        public registerWipChangeHandler(callback: Function) {
            this.onWipChangeCallbacks.push(callback);
        }

        /**
         * Invokes any change handler callbacks which were previously registered via
         * registerWipChangeHandler().
         */
        public invokeChangeCallbacks(done?: Function) {
            this.$q.all(this.onWipChangeCallbacks.map(fn => {
                return this.$q.when(fn());
            }))
                .then(() => {
                    if (typeof done === 'function') {
                        done();
                    }
                });
        }

        /**
         * Throws an exception if the item object does not have a `uuid` property.
         */
        private validateItem(item: any) {
            if (!item.uuid) {
                throw new Error('wipService: `item` does not have a `uuid` property.');
            }
        }

        /**
         * Check to see whether the item exists in the wipStore object. If not, an exception
         * is thrown.
         */
        private checkItemInWipStore(type: string, itemOrUuid: any) {
            var id = typeof itemOrUuid === 'string' ? itemOrUuid : itemOrUuid.uuid;
            if (!this.wipStore[type]) {
                throw new Error('wipService: the wipStore does not contain any items of the type "' + type + '".');
            } else if (!this.wipStore[type][id]) {
                throw new Error('wipService: item of type "' + type + '" with uuid "' + id + '" not found.');
            }
        }

        /**
         * Load any wips which have been persisted to localStorage via persistToLocalStorage().
         */
        private populateFromLocalStorage() {
            var localWipstore = this.localStorageService.get('wipStore'),
                localModifiedWips = this.localStorageService.get('modifiedWips');

            if (localWipstore) {
                this.wipStore = localWipstore;
            }
            if (localModifiedWips) {
                this.modifiedWips = localModifiedWips;
            }
        }

        /**
         * Persist the open wips to the browser's localStorage.
         */
        public persistLocal() {
            this.localStorageService.set('wipStore', this.wipStore);
            this.localStorageService.set('modifiedWips', this.modifiedWips);
        }

        /**
         * Clear any wip data from the browser's localStorage.
         */
        public clearLocal() {
            this.localStorageService.remove('wipStore');
            this.localStorageService.remove('modifiedWips');
        }
    }

    angular.module('meshAdminUi.common.wipService', ['LocalStorageModule'])
        .config(localStorageConfig)
        .service('wipService', WipService);
}