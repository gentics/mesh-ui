angular.module('caiLunAdminUi.projects')
    .controller('ContentEditorController', ContentEditorController);


function ContentEditorController($stateParams, contextService, dataService, wipService) {
    var vm = this,
        projectName = contextService.getProject().name;

    vm.persist = function(content) {
        dataService.persistContent(content);
    };

    getContentData().then(getSchema);

    /**
     * Get the content object either from the server if this is being newly opened, or from the
     * wipService if it exists there.
     *
     * @returns {*}
     */
    function getContentData() {
        var uuid = $stateParams.uuid,
            wipContent = wipService.getContent(uuid);

        if (wipContent) {
            vm.content = wipContent;
            return dataService.getSchema(vm.content.schema.schemaUuid);
        } else {
            return dataService
                .getContent(projectName, uuid)
                .then(function(data) {
                    vm.content = data;
                    wipService.openContent(data);
                    return dataService.getSchema(data.schema.schemaUuid);
                });
        }
    }

    /**
     * Load the schema data into the vm.
     * @param data
     */
    function getSchema(data) {
        vm.schema = data;
    }
}