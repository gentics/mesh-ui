angular.module('caiLunAdminUi.projects')
    .controller('ContentEditorController', ContentEditorController);


function ContentEditorController($stateParams, contextService, dataService) {
    var vm = this,
        projectName = contextService.getProject().name;

    vm.persist = function(content) {
        content.save();
    };

    dataService.getContent(projectName, $stateParams.uuid)
        .then(function(data) {
            vm.content = data;
            return dataService.getSchema(data.schema.schemaUuid);
        })
        .then(function(data) {
            vm.schema = data;
        });
}