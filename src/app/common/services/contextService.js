angular.module('caiLunAdminUi.common')
    .service('contextService', contextService);

/**
 * The contextService allows app-wide communication of the current project & tag which is
 * being viewed by the user. The purpose is to facilitate context-aware searching and creation of objects.
 */
function contextService() {
    var currentProject = {},
        currentTag = {};

    // public API
    this.setProject = setProject;
    this.getProject = getProject;
    this.setTag = setTag;
    this.getTag = getTag;

    /**
     *
     * @param name
     * @param id
     */
    function setProject(name, id) {
        currentProject.name = name;
        currentProject.id = id;
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
    }

    /**
     *
     * @returns {{}}
     */
    function getTag() {
        return currentTag;
    }
}