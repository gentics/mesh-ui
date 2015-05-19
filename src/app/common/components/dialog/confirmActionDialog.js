angular.module('meshAdminUi.common')
    .service('confirmActionDialog', ConfirmActionDialog)
    .controller('ConfirmActionDialogController', ConfirmActionDialogController);


/**
 * Service to display a confirmation dialog box, with a confirm and cancel button.
 * By default, it will display generic "delete object"? values, but these can
 * be customised by specifying an `options` object.
 *
 * @param {ng.material.MDDialogService} $mdDialog
 * @constructor
 */
function ConfirmActionDialog($mdDialog) {

    this.show = show;

    /**
     * Show a confirmation dialog box.
     *
     * @param {Object=} options
     * @param {string=} options.title
     * @param {string=} options.message
     * @param {string=} options.confirmLabel
     * @param {string=} options.cancelLabel
     * @param {string=} options.confirmButtonClass
     * @returns {ng.IPromise<*>}
     */
    function show(options) {
        options = options || {};
        var title = options.title || 'Delete?',
            message = options.message || 'Do you want to delete this object?',
            confirmLabel = options.confirmLabel || 'DELETE',
            cancelLabel = options.cancelLabel || 'CANCEL',
            confirmButtonClass = options.confirmButtonClass || 'btn-warn';


        return $mdDialog.show({
            templateUrl: 'common/components/dialog/confirmActionDialog.html',
            controller: 'ConfirmActionDialogController',
            controllerAs: 'vm',
            locals: {
                title: title,
                message: message,
                confirmLabel: confirmLabel,
                cancelLabel: cancelLabel,
                confirmButtonClass: confirmButtonClass
            },
            bindToController: true
        });
    }
}

/**
 * Controller used to set the return value of the close dialog box.
 *
 * @param {ng.material.MDDialogService} $mdDialog
 * @constructor
 */
function ConfirmActionDialogController($mdDialog) {
    var vm = this;

    vm.confirm = function() {
        $mdDialog.hide(true);
    };
    vm.cancel = function() {
        $mdDialog.cancel();
    };
}


