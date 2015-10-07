module meshAdminUi {

    export interface IConfirmActionDialogOptions {
        title: string;
        message?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        confirmButtonClass?: string;
    }

    /**
     * Service to display a confirmation dialog box, with a confirm and cancel button.
     * By default, it will display generic "delete object"? values, but these can
     * be customised by specifying an `options` object.
     */
    export class ConfirmActionDialog {

        constructor(private $mdDialog: ng.material.IDialogService) {

        }

        /**
         * Show a confirmation dialog box.
         */
        public show(options: IConfirmActionDialogOptions) {
            let locals = {
                title: options.title || 'Delete?',
                message: options.message || 'Do you want to delete this object?',
                confirmLabel:  options.confirmLabel || 'DELETE',
                cancelLabel: options.cancelLabel || 'CANCEL',
                confirmButtonClass:  options.confirmButtonClass || 'btn-warn'
            };

            return this.$mdDialog.show({
                templateUrl: 'common/components/dialog/confirmActionDialog.html',
                controller: 'confirmActionDialogController',
                controllerAs: 'vm',
                locals: locals,
                bindToController: true
            });
        }
    }

    /**
     * Controller used to set the return value of the close dialog box.
     */
    class ConfirmActionDialogController {

        constructor(private $mdDialog: ng.material.IDialogService) {
        }

        public confirm() {
            this.$mdDialog.hide(true);
        }

        public cancel() {
            this.$mdDialog.cancel();
        }
    }

    angular.module('meshAdminUi.common')
        .service('confirmActionDialog', ConfirmActionDialog)
        .controller('confirmActionDialogController', ConfirmActionDialogController);

}