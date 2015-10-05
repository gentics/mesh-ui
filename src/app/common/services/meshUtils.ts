angular.module('meshAdminUi.common')
    .factory('mu', meshUtils);

/**
 * A collection of static utility methods for use throughout the app.
 */
function meshUtils() {

    return {
        rolePermissionsArrayToKeys: rolePermissionsArrayToKeys,
        flatten: flatten
    };

    /**
     * Given an object `item` with a `rolePerms` property of type ['create', 'read', 'update' 'delete'], this function
     * will return a clone of the object with each permission as a key set to `true`.
     *
     * @param {Object} original
     * @returns {Object}
     */
    function rolePermissionsArrayToKeys(original) {
        var item = clone(original),
            perms = ['create', 'read', 'update', 'delete'];

        if (!(item.hasOwnProperty('rolePerms') && item.rolePerms instanceof Array)) {
            throw new Error('meshUtils#rolePermissionsArrayToKeys: argument must have a "rolePerms" property of type Array.');
        }

        perms.forEach(function(perm) {
            if (item.hasOwnProperty(perm)) {
                throw new Error('meshUtils#rolePermissionsArrayToKeys: item already has a key "' + perm + '".');
            } else {
                item[perm] = item.rolePerms.indexOf(perm) > -1;
            }
        });
        return item;
    }

    /**
     * Deep clone an object, from http://stackoverflow.com/a/122190/772859
     * Note that this will not handle object containing circular references.
     *
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


    /**
     * Flatten an n-dimensional array.
     *
     * @param {Array} mdArray
     * @returns {Array}
     */
    function flatten(mdArray) {
        var flatArray = [];

        if (!(mdArray instanceof Array)) {
            throw new Error('meshUtils#flatten: argument must be of type Array, got ' + typeof mdArray);
        }

        mdArray.forEach(function(item) {
            if (item instanceof Array) {
                flatArray = flatArray.concat(flatten(item));
            } else {
                flatArray.push(item);
            }
        });

        return flatArray;
    }
}