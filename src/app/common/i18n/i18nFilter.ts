module meshAdminUi {


    export interface I18nFilter {
        (value: string, values?: any): string;
    }

    /**
     * A convenience service for whenever translated strings need to be used in
     * code rather than in a view.
     *
     * Rather than injecting $filter and then doing
     * $filter('translate')('TRANSLATED_STRING');
     *
     * we can inject i18n and do
     * i18n('TRANSLATED_STRING');
     */
    export function i18nFilter($filter) {
        return $filter('translate');
    }

    angular.module('meshAdminUi.common.i18n')
        .factory('i18n', i18nFilter);

}