angular.module('meshAdminUi.common')
    .factory('mu', meshUtils);

/**
 * A collection of static utility methods for use throughout the app.
 * @returns {{permissionsArrayToKeys: permissionsArrayToKeys}}
 */
function meshUtils() {

    return {
        permissionsArrayToKeys: permissionsArrayToKeys
    };

    /**
     * Given an object `item` with a `perms` property of type ['create', 'read', 'update' 'delete'], this function
     * will return a clone of the object with each permission as a key set to `true`.
     *
     * @param {Object} original
     * @returns {Object}
     */
    function permissionsArrayToKeys(original) {
        var item = clone(original),
            perms = ['create', 'read', 'update', 'delete'];

        if (!(item.hasOwnProperty('perms') && item.perms instanceof Array)) {
            throw new Error('meshUtils#permissionsArrayToKeys: argument must have a "perms" property of type Array.');
        }

        perms.forEach(function(perm) {
            if (item.hasOwnProperty(perm)) {
                throw new Error('meshUtils#permissionsArrayToKeys: item already has a key "' + perm + '".');
            } else {
                item[perm] = item.perms.indexOf(perm) > -1;
            }
        });
        return item;
    }

    /**
     * Deep clone an object, from http://stackoverflow.com/a/122190/772859
     * @param obj
     * @returns {*}
     */
    function clone(obj) {
        if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

        var temp = obj.constructor();

        for(var key in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, key)) {
                obj.isActiveClone = null;
                temp[key] = clone(obj[key]);
                delete obj.isActiveClone;
            }
        }

        return temp;
    }
}