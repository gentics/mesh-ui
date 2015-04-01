angular.module('caiLunAdminUi.common')
    .service('contextService', contextService);

/**
 * The contextService allows app-wide communication of the current project & tag which is
 * being viewed by the user. The purpose is to facilitate context-aware searching and creation of objects.
 */
function contextService() {
    var currentProject = {},
        currentTag = {},
        contextChangeCallbacks = [];

    // public API
    this.registerContextChangeHandler = registerContextChangeHandler;
    this.setProject = setProject;
    this.getProject = getProject;
    this.setTag = setTag;
    this.getTag = getTag;

    /**
     * Allows components to register a callback when the context changes
     * @param callback
     */
    function registerContextChangeHandler(callback) {
        contextChangeCallbacks.push(callback);
    }

    /**
     *
     * @param name
     * @param id
     */
    function setProject(name, id) {
        currentProject.name = name;
        currentProject.id = id;
        runContextChangeHandlers();
    }

    /**
     *
     * @returns {{}}
     */
    function getProject() {
        return currentProject;
    }

    /**
     *
     * @param name
     * @param id
     */
    function setTag(name, id) {
        currentTag.name = name;
        currentTag.id = id;
        runContextChangeHandlers();
    }

    /**
     *
     * @returns {{}}
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