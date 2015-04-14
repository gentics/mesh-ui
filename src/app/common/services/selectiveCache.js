angular.module('caiLunAdminUi.common')
    .provider('selectiveCache', selectiveCacheProvider);

function selectiveCacheProvider() {

    var baseUrl = '',
        cacheableUrls = [];

    this.$get = function($cacheFactory) {
        return new SelectiveCache($cacheFactory, baseUrl, cacheableUrls);
    };

    /**
     * Set the base url which will be stripped from keys when performing
     * regexp matching.
     * @param value
     */
    this.setBaseUrl = function(value) {
        baseUrl = value;
    };

    /**
     * Set the urls which will have caching enabled.
     * @param {Array<RegExp>} values
     */
    this.setCacheableUrls = function(values) {
        values.forEach(function(value) {
            if (!(value instanceof RegExp)) {
                throw new Error('selectiveCacheProvider#setCacheableUrls(): argument must be an array of regular expressions.');
            }
        });
        cacheableUrls = values;
    };
}

/**
 * This is a wrapper around Angular's $cacheFactory cache, which provides the following enhancements:
 *
 * 1. It can be configured (see provider above) to only cache urls that match the provided regexps.
 * 2. It can selectively remove any keys from the cache which match the regexp passed to the .remove() method.
 *
 * @param $cacheFactory
 * @param {String} baseUrl
 * @param {Array<RegExp>} cacheableUrls
 * @constructor
 */
function SelectiveCache($cacheFactory, baseUrl, cacheableUrls) {

    var ngCache = $cacheFactory('selectiveCache'),
        cachedKeys = [];

    // public API - matches that of $cacheFactory#cache
    this.put = put;
    this.get = get;
    this.remove = remove;
    this.removeAll = removeAll;
    this.info = info;

    /**
     * Put a key-value pair into the cache as long as the key matches
     * one of the allowed urls set in `cacheableUrls`.
     * @param {String} key
     * @param {*} value
     */
    function put(key, value) {
        var keyMinusBase = key.replace(baseUrl, '');
        cacheableUrls.forEach(function(regexp) {
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
     * Remove cache entries as specified by the keyRegex. Returns the number of
     * cache keys removed.
     *
     * @param {RegExp} keyRegex
     * @returns {number}
     */
    function remove(keyRegex) {
        var matching = cachedKeys.filter(matches(keyRegex));
        matching.forEach(removeFromCache);

        return matching.length;
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

    function removeAll() {
        return ngCache.removeAll();
    }

    function info() {
        return ngCache.info();
    }
}