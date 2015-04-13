angular.module('caiLunAdminUi.common')
    .service('wipService', WipService);

function WipService() {
    var contents = {},
        onWipChangeCallbacks = [];

    this.openContent = openContent;
    this.closeContent = closeContent;
    this.getOpenContents = getOpenContents;
    this.registerWipChangeHandler = registerWipChangeHandler;

    function openContent(content) {
        contents[content.uuid] = content;
        invokeChangeCallbacks();
    }

    function closeContent(content) {
        if (contents[content.uuid]) {
            delete contents[content.uuid];
            invokeChangeCallbacks();
        }
    }

    function getOpenContents() {
        var contentsArray = [];

        for(var key in contents) {
            if (contents.hasOwnProperty(key)) {
                contentsArray.push(contents[key]);
            }
        }

        return contentsArray;
    }

    function registerWipChangeHandler(callback) {
        onWipChangeCallbacks.push(callback);
    }

    function invokeChangeCallbacks() {
        onWipChangeCallbacks.forEach(function(fn) {
            fn();
        });
    }

}