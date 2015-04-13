angular.module('caiLunAdminUi.projects')
    .controller('ContentEditorController', ContentEditorController);


function ContentEditorController($stateParams, contextService, dataService, wipService) {
    var vm = this,
        projectName = contextService.getProject().name;

    vm.persist = function(content) {
        dataService.persistContent(content);
    };

    dataService.getContent(projectName, $stateParams.uuid)
        .then(function(data) {
            vm.content = data;
            wipService.openContent(data.plain());
            return dataService.getSchema(data.schema.schemaUuid);
        })
        .then(function(data) {
            vm.schema = data;
        });
}