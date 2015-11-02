module meshAdminUi {

    function selectiveCacheProvider(): any {

        var baseUrl = '',
            cacheableGroups = {};

        this.$get = function ($cacheFactory) {
            return new SelectiveCache($cacheFactory, baseUrl, cacheableGroups);
        };

        /**
         * Set the base url which will be stripped from keys when performing
         * regexp matching. Can also be done in the service itself.
         * @param value
         */
        this.setBaseUrl = function (value) {
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
        this.setCacheableGroups = function (values) {
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
    export class SelectiveCache {

        private ngCache;
        private cachedKeys: any[] = [];
        private cachableRegexps;

        constructor(private $cacheFactory: ng.ICacheFactoryService,
                    private baseUrl: string,
                    private cacheableGroups: any) {

            this.ngCache = $cacheFactory('selectiveCache');
            this.cachedKeys = [];
            this.cachableRegexps = this.objectValues(cacheableGroups);
        }

        /**
         * Put a key-value pair into the cache as long as the key matches
         * one of the allowed urls set in `cacheableUrls`.
         */
        public put(key: string, value: any) {
            var keyMinusBase = key.replace(this.baseUrl, '');
            this.cachableRegexps.forEach(regexp => {
                if (-1 < keyMinusBase.search(regexp)) {
                    this.cachedKeys.push(key);
                    return this.ngCache.put(key, value);
                }
            });
        }

        /**
         * Get the value associated with the key.
         */
        public get(key) {
            return this.ngCache.get(key);
        }

        /**
         * Remove cache entries that match the regex defined by `group`
         * (see selectiveCacheProvider.setCacheableGroups()).
         * Throws an exception if the group was not already defined in the provider.
         * Returns the number of cache keys removed.
         */
        public remove(group: string): number {
            if (this.cacheableGroups[group] instanceof RegExp) {
                var keyRegexp = this.cacheableGroups[group],
                    filterFn =  this.matches(keyRegexp),
                    matching = this.cachedKeys.filter(filterFn);
                matching.forEach(match => this.removeFromCache(match));

                return matching.length;
            }
        }

        /**
         * Returns a filter function which matches each passed element against the
         * regex.
         */
        private matches(regexp: RegExp): (key: string) => boolean {
            return (key) => {
                var keyMinusBase = key.replace(this.baseUrl, '');
                return -1 < keyMinusBase.search(regexp);
            };
        }

        /**
         * Remove the key from the cache.
         */
        public removeFromCache(key: string) {
            this.ngCache.remove(key);
            this.removeFromCachedKeys(key);
        }

        /**
         * Remove the specified key from the cachedKeys array.
         */
        public removeFromCachedKeys(key: string) {
            var index = this.cachedKeys.indexOf(key);
            if (index > -1) {
                this.cachedKeys.splice(index, 1);
            }
        }

        /**
         * Delegate directly to Angular's cache method.
         */
        public removeAll() {
            return this.ngCache.removeAll();
        }

        /**
         * Delegate directly to Angular's cache method.
         */
        public info() {
            return this.ngCache.info();
        }

        /**
         * Duplicate of the selectiveCacheProvider#setBaseUrl()
         */
        public setBaseUrl(value: string) {
            this.baseUrl = value;
        }

        /**
         * Get the values from an object as an array;
         */
        private objectValues(obj: any): any[] {
            var values = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    values.push(obj[key]);
                }
            }
            return values;
        }
    }

    angular.module('meshAdminUi.common')
           .provider('selectiveCache', selectiveCacheProvider);

}