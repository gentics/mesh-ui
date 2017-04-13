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

        constructor(private $q: ng.IQService,
                    private i18nService: I18nService,
                    private localStorageService,
                    private mu: MeshUtils,
                    private dispatcher: Dispatcher) {

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
            let lang = this.i18nService.getCurrentLang().code;
            if (!this.wipStore[lang][type]) {
                this.wipStore[lang][type] = {};
                this.modifiedWips[lang][type] = {};
            }
            if (this.wipStore[lang][type][item.uuid]) {
                console.warn('wipStore#openItem: "' + type + '" with uuid "' +
                    item.uuid + '" is already open.');
            }
            this.wipStore[lang][type][item.uuid] = {
                item: item,
                metadata: metadata || {}
            };
            this.dispatcher.publish(this.dispatcher.events.wipsChanged)
        }

        /**
         * Updates an open wip item by extending it with the properties of the new object.
         * Preserves the object reference.
         */
        public updateItem<T extends IMeshBaseProps>(type: string, item: T) {
            this.validateItem(item);
            if (!this.isOpen(type, item.uuid)) {
                throw new Error('wipStore#updateItem: "' + type + '" with uuid "' +
                    item.uuid + '" is not open in the wipStore.');
            }

            angular.extend(this.getItem(type, item.uuid), item);
        }

        /**
         * Set a key-value pair on the wip item's metadata object.
         */
        public setMetadata(type: string, uuid: string, key: string, value: any) {
            let lang = this.i18nService.getCurrentLang().code;
            if (this.wipStore[lang][type] && this.wipStore[lang][type][uuid]) {
                this.wipStore[lang][type][uuid].metadata[key] = value;
            }
        }

        /**
         * Get the metadata associated with the wip item.
         */
        public getMetadata(type: string, uuid: string): any {
            let lang = this.i18nService.getCurrentLang().code;
            this.checkItemInWipStore(type, uuid);
            return this.wipStore[lang][type][uuid].metadata;
        }

        /**
         * Mark the item as having been modified,
         * which determines its behaviour on closing.
         */
        public setAsModified(type: string, item: any) {
            let lang = this.i18nService.getCurrentLang().code;
            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            this.modifiedWips[lang][type][item.uuid] = true;
            this.dispatcher.publish(this.dispatcher.events.wipsChanged);
        }

        /**
         * Set the item to be unmodified. Useful in the situation where a modified item
         * is persisted to the server, but we want to keep it open in the wipStore but
         * indicate that it is unmodified and okay to close.
         */
        public setAsUnmodified(type: string, item: any) {
            let lang = this.i18nService.getCurrentLang().code;
            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            this.modifiedWips[lang][type][item.uuid] = false;
            this.dispatcher.publish(this.dispatcher.events.wipsChanged);
        }

        /**
         * Checks to see if the item in the store has been modified.
         */
        public isModified(type: string, item: INode): boolean {
            let lang = this.i18nService.getCurrentLang().code;
            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            return this.modifiedWips[lang][type][item.uuid] === true;
        }

        /**
         * Remove an existing item of the specified type from the store.
         */
        public closeItem(type: string, item: any): ng.IPromise<any> {
            let lang = this.i18nService.getCurrentLang().code;
            let deferred = this.$q.defer();

            this.validateItem(item);
            this.checkItemInWipStore(type, item);
            delete this.wipStore[lang][type][item.uuid];
            delete this.modifiedWips[lang][type][item.uuid];
            deferred.resolve(item);
            this.dispatcher.publish(this.dispatcher.events.wipsChanged);
            return deferred.promise;
        }

        /**
         * Get an array of all open items of the specified type.
         */
        public getOpenItems(type: string): any[] {
            let lang = this.i18nService.getCurrentLang().code;
            let itemsArray = [];

            if (this.wipStore[lang] && this.wipStore[lang][type]) {
                for (var key in this.wipStore[lang][type]) {
                    if (this.wipStore[lang][type].hasOwnProperty(key)) {
                        itemsArray.push(this.wipStore[lang][type][key]);
                    }
                }
            }
            return itemsArray;
        }

        /**
         * Is the item of the given type and UUID open in the wip store?
         */
        public isOpen(type: string, uuid: string): boolean {
            let lang = this.i18nService.getCurrentLang().code;
            return !!(this.wipStore[lang][type] && this.wipStore[lang][type].hasOwnProperty(uuid));
        }

        /**
         * Get an array of uuids of each item of the specified type which has been modified.
         */
        public getModifiedItems(type: string): any[] {
            let lang = this.i18nService.getCurrentLang().code;
            let itemsArray = [];

            if (this.modifiedWips[lang] && this.modifiedWips[lang][type]) {
                for (var key in this.modifiedWips[lang][type]) {
                    if (this.modifiedWips[lang][type].hasOwnProperty(key) && this.modifiedWips[lang][type][key] === true) {
                        itemsArray.push(key);
                    }
                }
            }
            return itemsArray;
        }

        /**
         * Returns the wip content specified by the uuid if it exists in the contents store.
         */
        public getItem(type: string, uuid: string): any {
            let lang = this.i18nService.getCurrentLang().code;
            return this.wipStore[lang][type] && this.wipStore[lang][type][uuid] && this.wipStore[lang][type][uuid].item;
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
            let lang = this.i18nService.getCurrentLang().code;
            let id = typeof itemOrUuid === 'string' ? itemOrUuid : itemOrUuid.uuid;
            if (!this.wipStore[lang][type]) {
                throw new Error('wipService: the wipStore does not contain any items of the type "' + type + '".');
            } else if (!this.wipStore[lang][type][id]) {
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

            this.i18nService.getAvailableLanguages().forEach((lang: ILanguageInfo) => {
                if (!this.wipStore[lang.code]) {
                    this.wipStore[lang.code] = {};
                }
                if (!this.modifiedWips[lang.code]) {
                    this.modifiedWips[lang.code] = {};
                }
            });
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