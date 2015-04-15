angular.module('caiLunAdminUi.common.i18n')
    .factory('i18n', i18nFilter);

/**
 * A convenience service for whenever translated strings need to be used in
 * code rather than in a view.
 *
 * Rather than injecting $filter and then doing
 * $filter('translate')('TRANSLATED_STRING');
 *
 * we can inject i18n and do
 * i18n('TRANSLATED_STRING');
 *
 * @param $filter
 * @returns {*}
 */
function i18nFilter($filter) {
    return $filter('translate');
}