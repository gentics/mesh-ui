angular.module('caiLunAdminUi.projects')
    .controller('ContentEditorController', ContentEditorController);


function ContentEditorController($scope, $state, $stateParams, contextService, i18nService, dataService, wipService, notifyService) {
    var vm = this,
        wipType = 'contents',
        projectName = contextService.getProject().name,
        parentTagId = $stateParams.tagId;

    vm.isNew = false;
    vm.contentModified = false;
    vm.availableLangs = i18nService.languages;
    vm.selectedLangs = {};
    vm.selectedLangs[i18nService.getCurrentLang().code] = true; // set the default language
    vm.canDelete = canDelete;
    vm.persist = persist;
    vm.remove = remove;

    getContentData().then(populateSchema).then(getParentTag);

    $scope.$watch('vm.contentModified', modifiedWatchHandler);
    $scope.$on('$destroy', saveWipMetadata);

    /**
     * Save the changes back to the server.
     * @param {Object} content
     */
    function persist(content) {
        dataService.persistContent(projectName, content)
            .then(function(response) {
                if (vm.isNew) {
                    wipService.closeItem(wipType, content);
                    content.uuid = response.uuid;
                    wipService.openItem(wipType, content, { projectName: projectName, parentTagId: parentTagId });
                    vm.isNew = false;
                } else {
                    notifyService.toast('SAVED_CHANGES');
                    wipService.setAsUnmodified(wipType, vm.content);
                    vm.contentModified = false;
                }
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
            return -1 < vm.content.perms.indexOf('delete') && !vm.isNew;
        }
    }


    function getParentTag() {
        wipService.setMetadata(wipType, vm.content.uuid, 'parentTagId', parentTagId);
        if (!vm.parentTag) {
            return dataService.getTag(projectName, parentTagId)
                .then(function (tag) {
                    vm.parentTag = tag;
                });
        }
    }

    /**
     * Get the content object either from the server if this is being newly opened, or from the
     * wipService if it exists there.
     *
     * @returns {ng.IPromise}
     */
    function getContentData() {
        var currentTagId = $stateParams.uuid,
            schemaId = $stateParams.schemaId;

        if (currentTagId) {
            // loading existing content
            var wipContent = wipService.getItem(wipType, currentTagId);

            if (wipContent) {
                return populateFromWip(wipContent);
            } else {
                return dataService
                    .getContent(projectName, currentTagId)
                    .then(function (data) {
                        vm.content = data;
                        wipService.openItem(wipType, data, { projectName: projectName, parentTagId: parentTagId });
                        return dataService.getSchema(data.schema.schemaUuid);
                    });
            }
        } else if (schemaId) {
            // creating new content
            vm.isNew = true;
            return dataService.getSchema(schemaId)
                .then(function(schema) {
                    vm.content = createEmptyContent(parentTagId, schema.uuid, schema.title);
                    wipService.openItem(wipType, vm.content, { projectName: projectName, parentTagId: parentTagId, isNew: true });
                    return schema;
                });
        }
    }

    /**
     * Populate the vm based on the content item retrieved from the wipService.
     * @param {Object} wipContent
     * @returns {ng.IPromise}
     */
    function populateFromWip(wipContent) {
        var wipMetadata = wipService.getMetadata(wipType, wipContent.uuid);
        vm.content = wipContent;
        vm.contentModified = wipService.isModified(wipType, vm.content);
        vm.selectedLangs = wipMetadata.selectedLangs;
        return dataService.getSchema(vm.content.schema.schemaUuid);
    }

    /**
     * Create an empty content object which is pre-configured according to the arguments passed.
     *
     * @param {string} parentTagId
     * @param {string} schemaId
     * @param {string} schemaName
     * @returns {{tagUuid: *, perms: string[], uuid: *, schema: {schemaUuid: *}, schemaName: *}}
     */
    function createEmptyContent(parentTagId, schemaId, schemaName) {
        return {
            tagUuid: parentTagId,
            perms: ['read', 'create', 'update', 'delete'],
            uuid: wipService.generateTempId(),
            schema: {
                schemaUuid: schemaId
            },
            schemaName: schemaName // legacy TODO: remove this in favour of nested schema data above
        };
    }

    /**
     * Load the schema data into the vm.
     * @param {Object} data
     */
    function populateSchema(data) {
        vm.schema = data;
    }
}