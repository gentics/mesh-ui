angular.module('meshAdminUi.common')
    .service('contextService', contextService);

/**
 * The contextService allows app-wide communication of the current project & tag which is
 * being viewed by the user. The purpose is to facilitate context-aware searching and creation of objects.
 */
function contextService() {
    var currentProject = { name: '', id: '' },
        currentNode = { id: ''},
        contextChangeCallbacks = [];

    // public API
    this.registerContextChangeHandler = registerContextChangeHandler;
    this.setProject = setProject;
    this.getProject = getProject;
    this.setParentNode = setParentNode;
    this.getParentNode = getParentNode;

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

    function setParentNode(id) {
        currentNode.id = id;
        runContextChangeHandlers();
    }

    function getParentNode() {
        return currentNode;
    }

    /**
     * Invoke any registered context change handlers and pass each one the
     * current project and tag objects.
     */
    function runContextChangeHandlers() {
        contextChangeCallbacks.forEach(function(fn) {
            fn.call(null, currentProject, currentNode);
        });
    }
}