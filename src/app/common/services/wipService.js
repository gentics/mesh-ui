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
    var contents = {},
        onWipChangeCallbacks = [];

    this.openContent = openContent;
    this.closeContent = closeContent;
    this.getContent = getContent;
    this.getOpenContents = getOpenContents;
    this.registerWipChangeHandler = registerWipChangeHandler;

    /**
     * Add a new content items to the open contents store.
     * @param {Object} content
     */
    function openContent(content) {
        contents[content.uuid] = content;
        invokeChangeCallbacks();
    }

    /**
     * Remove an existing content item from the open contents store.
     * @param content
     */
    function closeContent(content) {
        if (contents[content.uuid]) {
            delete contents[content.uuid];
            invokeChangeCallbacks();
        }
    }

    /**
     * Get an array of all open contents.
     * @returns {Array}
     */
    function getOpenContents() {
        var contentsArray = [];
        for(var key in contents) {
            if (contents.hasOwnProperty(key)) {
                contentsArray.push(contents[key]);
            }
        }
        return contentsArray;
    }

    /**
     * Returns the wip content specified by the uuid if it exists in the contents store.
     *
     * @param {String} uuid
     * @returns {*}
     */
    function getContent(uuid) {
        return contents[uuid];
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