angular.module('meshAdminUi.common')
    .provider('selectiveCache', selectiveCacheProvider);

function selectiveCacheProvider() {

    var baseUrl = '',
        cacheableGroups = {};

    this.$get = function($cacheFactory) {
        return new SelectiveCache($cacheFactory, baseUrl, cacheableGroups);
    };

    /**
     * Set the base url which will be stripped from keys when performing
     * regexp matching. Can also be done in the service itself.
     * @param value
     */
    this.setBaseUrl = function(value) {
        baseUrl = value;
    };

    /**
     * Set the urls which will have caching enabled. Should be a hash of { groupName: urlRegexp }:
     * {
     *   'contents': /^\/contents.+/,
     *   'users': /^\/users\/[0-9]{5}$/
     * }
     *
     * So in this case, requests to the "contents" or "users" urls (which would match
     * the regexp patterns defined above) would be cached. No other requests would be.
     *
     * Then the cached entries can be selectively removed later on with the
     * selectiveCache.remove() method, passing in the group name.
     *
     * E.g. to remove all cache entries to do with contents, you would do:
     *
     * selectiveCache.remove('contents');
     *
     * @param {Object.<String, RegExp>} values
     */
    this.setCacheableGroups = function(values) {
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                if (!(values[key] instanceof RegExp)) {
                    throw new Error('selectiveCacheProvider#setCacheableGroups():  "' +
                                    values[key] + '" should be a regular expression.');
                }
            }
        }
        cacheableGroups = values;
    };
}

/**
 * This is a wrapper around Angular's $cacheFactory cache, which provides the following enhancements:
 *
 * 1. It can be configured (see provider above) to only cache groups of urls that match the provided regexps.
 * 2. These urls groups can then be selectively removed from the cache by passing the name of the group
 *    to the .remove() method.
 *
 * @param $cacheFactory
 * @param {String} baseUrl
 * @param {Object.<String, RegExp>} cacheableGroups
 * @constructor
 */
function SelectiveCache($cacheFactory, baseUrl, cacheableGroups) {

    var ngCache = $cacheFactory('selectiveCache'),
        cachedKeys = [],
        cachableRegexps = objectValues(cacheableGroups);

    // public API - matches that of $cacheFactory#cache
    this.put = put;
    this.get = get;
    this.remove = remove;
    this.removeAll = removeAll;
    this.info = info;

    // additional config methods
    this.setBaseUrl = setBaseUrl;

    /**
     * Put a key-value pair into the cache as long as the key matches
     * one of the allowed urls set in `cacheableUrls`.
     * @param {String} key
     * @param {*} value
     */
    function put(key, value) {
        var keyMinusBase = key.replace(baseUrl, '');
        cachableRegexps.forEach(function(regexp) {
            if (-1 < keyMinusBase.search(regexp)) {
                cachedKeys.push(key);
                return ngCache.put(key, value);
            }
        });
    }

    /**
     * Get the value associated with the key.
     * @param {String} key
     * @returns {*}
     */
    function get(key) {
        return ngCache.get(key);
    }

    /**
     * Remove cache entries that match the regex defined by `group`
     * (see selectiveCacheProvider.setCacheableGroups()).
     * Throws an exception if the group was not already defined in the provider.
     * Returns the number of cache keys removed.
     *
     * @param {String} group
     * @returns {number}
     */
    function remove(group) {
        if (cacheableGroups[group] instanceof RegExp) {
            var keyRegexp = cacheableGroups[group],
                matching = cachedKeys.filter(matches(keyRegexp));
            matching.forEach(removeFromCache);

            return matching.length;
        }
    }

    /**
     * Returns a filter function which matches each passed element against the
     * regex.
     *
     * @param {RegExp} regexp
     * @returns {Function}
     */
    function matches(regexp) {
        return function (key) {
            var keyMinusBase = key.replace(baseUrl, '');
            return -1 < keyMinusBase.search(regexp);
        };
    }

    /**
     * Remove the key from the cache.
     * @param {String} key
     */
    function removeFromCache(key) {
        ngCache.remove(key);
        removeFromCachedKeys(key);
    }

    /**
     * Remove the specified key from the cachedKeys array.
     * @param key
     */
    function removeFromCachedKeys(key) {
        var index = cachedKeys.indexOf(key);
        if (index > -1) {
            cachedKeys.splice(index, 1);
        }
    }

    /**
     * Delegate directly to Angular's cache method.
     * @returns {void|*}
     */
    function removeAll() {
        return ngCache.removeAll();
    }

    /**
     * Delegate directly to Angular's cache method.
     * @returns {void|*}
     */
    function info() {
        return ngCache.info();
    }

    /**
     * Duplicate of the selectiveCacheProvider#setBaseUrl()
     * @param {String} value
     */
    function setBaseUrl(value) {
        baseUrl = value;
    }

    /**
     * Get the values from an object as an array;
     * @param obj
     * @returns {Array}
     */
    function objectValues(obj) {
        var values = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                values.push(obj[key]);
            }
        }
        return values;
    }
}