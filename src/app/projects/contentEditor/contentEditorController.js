angular.module('caiLunAdminUi.projects')
    .controller('ContentEditorController', ContentEditorController);


function ContentEditorController($scope, $state, $stateParams, contextService, i18nService, dataService, wipService, notifyService) {
    var vm = this,
        wipType = 'contents',
        projectName = contextService.getProject().name;

    vm.contentModified = false;
    vm.selectedLangs = {};
    vm.selectedLangs[i18nService.getLanguage()] = true; // set the default language
    vm.canDelete = canDelete;
    vm.persist = persist;
    vm.remove = remove;

    getContentData().then(getSchema);
    $scope.$watch('vm.contentModified', modifiedWatchHandler);
    $scope.$on('$destroy', saveWipMetadata);

    /**
     * Save the changes back to the server.
     * @param {Object} content
     */
    function persist(content) {
        dataService.persistContent(content)
            .then(function() {
                notifyService.toast('SAVED_CHANGES');
                wipService.setAsUnmodified(wipType, vm.content);
                vm.contentModified = false;
            });
    }

    function remove(content) {
        dataService.deleteContent(content)
            .then(function() {
                notifyService.toast('Deleted');
                $state.go('projects.explorer');
            });
    }

    /**
     * When the value of vm.contentModified evaluates to true, set the wip as
     * modified.
     * @param val
     */
    function modifiedWatchHandler(val) {
        if (val === true) {
            wipService.setAsModified(wipType, vm.content);
        }
    }

    function saveWipMetadata() {
        wipService.setMetadata(wipType, vm.content.uuid, 'selectedLangs', vm.selectedLangs);
    }

    function canDelete() {
        if (vm.content) {
            return -1 < vm.content.perms.indexOf('delete');
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
            wipContent = wipService.getItem(wipType, uuid);

        if (wipContent) {
            vm.content = wipContent;
            vm.contentModified = wipService.isModified(wipType, vm.content);
            vm.selectedLangs = wipService.getMetadata(wipType, vm.content.uuid).selectedLangs;
            return dataService.getSchema(vm.content.schema.schemaUuid);
        } else {
            return dataService
                .getContent(projectName, uuid)
                .then(function(data) {
                    vm.content = data;
                    wipService.openItem(wipType, data);
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