angular.module('caiLunAdminUi.projects')
    .controller('ContentEditorController', ContentEditorController);


function ContentEditorController($scope, $stateParams, contextService, dataService, wipService, notifyService) {
    var vm = this,
        projectName = contextService.getProject().name;

    vm.contentModified = false;
    vm.persist = persist;

    getContentData().then(getSchema);

    $scope.$watch('vm.contentModified', modifiedWatchHandler);

    /**
     * Persist the content data back to the server, notify user
     * and update the wipService.
     *
     * @param {Object} content
     */
    function persist(content) {
        dataService.persistContent(content);
        notifyService.toast('SAVED_CHANGES');
        wipService.setAsUnmodified('contents', vm.content);
        vm.contentModified = false;
    }

    /**
     * When the value of vm.contentModified evaluates to true, set the wip as
     * modified.
     * @param val
     */
    function modifiedWatchHandler(val) {
        if (val === true) {
            wipService.setAsModified('contents', vm.content);
        }
    }

    /**
     * Get the content object either from the server if this is being newly opened, or from the
     * wipService if it exists there.
     *
     * @returns {ng.IPromise}
     */
    function getContentData() {
        var uuid = $stateParams.uuid,
            wipContent = wipService.getItem('contents', uuid);

        if (wipContent) {
            vm.content = wipContent;
            vm.contentModified = wipService.isModified('contents', vm.content);
            return dataService.getSchema(vm.content.schema.schemaUuid);
        } else {
            return dataService
                .getContent(projectName, uuid)
                .then(function(data) {
                    vm.content = data;
                    wipService.openItem('contents', data);
                    return dataService.getSchema(data.schema.schemaUuid);
                });
        }
    }

    /**
     * Load the schema data into the vm.
     * @param {Object} data
     */
    function getSchema(data) {
        vm.schema = data;
    }
}