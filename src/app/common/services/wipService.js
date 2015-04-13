angular.module('caiLunAdminUi.common')
    .service('wipService', WipService);

/**
 * Service to track work-in-progress (WIP) items, i.e. objects which have
 * been opened for editing but have not had their changes persisted back
 * to the server. This service allows the user to edit multiple open objects
 * at once, and tracks whether they need to be persisted.
 *
 * @constructor
 */
function WipService() {
    var wipStore = {},
        onWipChangeCallbacks = [];

    this.openItem = openItem;
    this.closeItem = closeItem;
    this.getItem = getItem;
    this.getOpenItems = getOpenItems;
    this.registerWipChangeHandler = registerWipChangeHandler;

    /**
     * Add a new wip item of specified type to the store.
     * @param {String} type
     * @param {Object} item
     */
    function openItem(type, item) {
        if (!wipStore[type]) {
            wipStore[type] = {};
        }
        wipStore[type][item.uuid] = item;
        invokeChangeCallbacks();
    }

    /**
     * Remove an existing item of the specified type from the store.
     * @param {String} type
     * @param {Object} item
     */
    function closeItem(type, item) {
        if (wipStore[type] && wipStore[type][item.uuid]) {
            delete wipStore[type][item.uuid];
            invokeChangeCallbacks();
        }
    }

    /**
     * Get an array of all open items of the specified type.
     * @param {String} type
     * @returns {Array}
     */
    function getOpenItems(type) {
        var contentsArray = [];

        if (wipStore[type]) {
            for (var key in wipStore[type]) {
                if (wipStore[type].hasOwnProperty(key)) {
                    contentsArray.push(wipStore[type][key]);
                }
            }
        }
        return contentsArray;
    }

    /**
     * Returns the wip content specified by the uuid if it exists in the contents store.
     *
     * @param {String} type
     * @param {String} uuid
     * @returns {*}
     */
    function getItem(type, uuid) {
        return wipStore[type] && wipStore[type][uuid];
    }

    /**
     * Register a callback function which will be invoked every time there is a change to
     * the status of wip items (i.e. whenever a new wip item is opened, or an existing one
     * is closed).
     *
     * @param {Function} callback
     */
    function registerWipChangeHandler(callback) {
        onWipChangeCallbacks.push(callback);
    }

    /**
     * Invokes any change handler callbacks which were previously registered via
     * registerWipChangeHandler().
     */
    function invokeChangeCallbacks() {
        onWipChangeCallbacks.forEach(function(fn) {
            fn();
        });
    }

}