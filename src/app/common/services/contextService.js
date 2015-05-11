angular.module('meshAdminUi.common')
    .service('contextService', contextService);

/**
 * The contextService allows app-wide communication of the current project & tag which is
 * being viewed by the user. The purpose is to facilitate context-aware searching and creation of objects.
 */
function contextService() {
    var currentProject = { name: '', id: '' },
        currentTag = { name: '', id: '' },
        contextChangeCallbacks = [];

    // public API
    this.registerContextChangeHandler = registerContextChangeHandler;
    this.setProject = setProject;
    this.getProject = getProject;
    this.setTag = setTag;
    this.getTag = getTag;

    /**
     * Allows components to register a callback when the context changes
     * @param {function()} callback
     */
    function registerContextChangeHandler(callback) {
        contextChangeCallbacks.push(callback);
    }

    /**
     * Set the current project and invoke any registered handlers
     * @param {string} name
     * @param {string} id
     */
    function setProject(name, id) {
        currentProject.name = name;
        currentProject.id = id;
        runContextChangeHandlers();
    }

    /**
     * Get the current project object.
     * @returns {{name: string, id: string}}
     */
    function getProject() {
        return currentProject;
    }

    /**
     * Set the current tag and invoke any registered handlers
     * @param {string} name
     * @param {string} id
     */
    function setTag(name, id) {
        currentTag.name = name;
        currentTag.id = id;
        runContextChangeHandlers();
    }

    /**
     * Get the current tag object
     * @returns {{name: string, id: string}}
     */
    function getTag() {
        return currentTag;
    }

    /**
     * Invoke any registered context change handlers and pass each one the
     * current project and tag objects.
     */
    function runContextChangeHandlers() {
        contextChangeCallbacks.forEach(function(fn) {
            fn.call(null, currentProject, currentTag);
        });
    }
}