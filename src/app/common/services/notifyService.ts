module meshAdminUi {

    /**
     * Service that deals with notifications for the user. There are two types of
     * notification: toast and message.
     *
     * Toast is for transient status updates that are displayed for a short time to the
     * user upon completion of some action, e.g. saving changes.
     *
     * Messages are for more persistent notifications that require user-intervention to
     * view and dismiss. The presence of such messages would be indicated by some
     * visual alert in the UI, which the user can then click through to get to
     * a list of current messages.
     */
    export class NotifyService {

        constructor(private $mdToast: ng.material.IToastService,
                    private i18n: Function) {

        }

        /**
         * Display a toast (popup) message containing the specified text.
         */
        public toast(text: string) {
            var popup = this.$mdToast.simple()
                .content(this.i18n(text))
                .position('top right');
            this.$mdToast.show(popup);
        }

        public message(text: string) {
            // TODO: implement
        }
    }

    angular.module('meshAdminUi.common')
           .service('notifyService', NotifyService);

}