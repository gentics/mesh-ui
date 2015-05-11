angular.module('meshAdminUi.common')
    .service('notifyService', NotifyService);

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
 *
 * @param $mdToast
 * @param i18n
 * @constructor
 */
function NotifyService($mdToast, i18n) {

    this.toast = toast;
    this.message = message;

    /**
     * Display a toast (popup) message containing the specified text.
     * @param text
     */
    function toast(text) {
        var popup = $mdToast.simple()
            .content(i18n(text))
            .position('top right');
        $mdToast.show(popup);
    }

    function message(text) {
        // TODO: implement
    }
}