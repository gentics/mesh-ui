module meshAdminUi {

    // the global meshUiConfig as defined in mesh-ui-config.js
    declare var meshUiConfig: any;

    /**
     * A collection of static utility methods for use throughout the app.
     */
    export class MeshUtils {

        /**
         * Given an object `item` with a `rolePerms` property of type ['create', 'read', 'update' 'delete'], this function
         * will return an object with each permission as a key set to `true`.
         * TODO: rendered redundant due to change in Mesh API. Remove once refactored out of all app code.
         */
        public rolePermissionsArrayToKeys(item: any): any {
            var permissions = {},
                perms = ['create', 'read', 'update', 'delete'];

            if (!(item.hasOwnProperty('rolePerms') && item.rolePerms instanceof Array)) {
                throw new Error('meshUtils#rolePermissionsArrayToKeys: argument must have a "rolePerms" property of type Array.');
            }

            perms.forEach(function (perm) {
                if (item.hasOwnProperty(perm)) {
                    throw new Error('meshUtils#rolePermissionsArrayToKeys: item already has a key "' + perm + '".');
                } else {
                    permissions[perm] = item.rolePerms.indexOf(perm) > -1;
                }
            });
            return permissions;
        }

        /**
         * Transform the object found in the "tags" property of a node into an array of tag objects.
         */
        public nodeTagsObjectToArray(tagsObject: INodeTagsObject): ITag[] {

            if (typeof tagsObject === 'undefined') {
                return [];
            }

            const makeSimpleTag = (item, tagsObject, familyName) => {
                return {
                    uuid: item.uuid,
                    fields: { name: item.name },
                    tagFamily: {
                        name: familyName,
                        uuid: tagsObject[familyName].uuid
                    }
                };
            };

            return Object.keys(tagsObject).reduce((prev, curr) => {
                let familyTags = tagsObject[curr].items.map(item => makeSimpleTag(item, tagsObject, curr));
                return prev.concat(familyTags);
            }, []);
        }

        public stringToColor(input: string): string {
            const safeColors = ['#D1D5FF', '#FFFBD1', '#EAE3FF', '#E3FFF3', '#E3EEFF', '#FFE3EA'];
            let value = input.split('').reduce((prev, curr) => {
                return prev + curr.charCodeAt(0);
            }, 0);
            return safeColors[value % safeColors.length];
        }

        public getBinaryFileUrl(projectName: string, nodeUuid: string, languageCode: string, fieldName: string, sha512sum: string, imageOptions?: IImageOptions) {
            let queryParams = `?cs=${sha512sum && sha512sum.substring(0, 8).toLowerCase()}`;
            if (imageOptions !== undefined) {
                queryParams = Object.keys(imageOptions).reduce((queryString, key) => {
                    return queryString + `&${key}=${imageOptions[key]}`;
                }, queryParams);
            }
            return meshUiConfig.apiUrl + projectName + `/nodes/${nodeUuid}/binary/${fieldName + queryParams}`;
        }

        /**
         * Given a node, check for any binary fields if one if found, return the first
         * in an object with key (field name) and value (binary field properties).
         */
        public getFirstBinaryField(node: INode): { key: string; value: IBinaryField } {
            let binaryFieldKey;
            let binaryFieldValue;

            if (node) {
                for (let key in node.fields) {
                    let field = node.fields[key];
                    if (field && field.fileSize) {
                        if (binaryFieldValue === undefined) {
                            binaryFieldKey = key;
                            binaryFieldValue = field;
                        }
                    }
                }

                return {
                    key: binaryFieldKey,
                    value: binaryFieldValue
                };
            }
        }

        /**
         * Reads the mime type of a binary field and returns true if it is an image.
         */
        public isImageField(field: IBinaryField): boolean {
            if (field.mimeType !== undefined) {
                return this.isImageMimeType(field.mimeType);
            }
            return false;
        }

        public isImageMimeType(mimeType: string): boolean {
            return (/^image\//.test(mimeType));
        }

        /**
         * Deep clone an object, but leave any File objects intact since they
         * cannot be copied.
         *
         * Based on http://stackoverflow.com/a/728694/772859
         * Note that this will not handle object containing circular references.
         */
        public safeClone(obj: any): any {
            let copy;

            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (let i = 0, len = obj.length; i < len; i++) {
                    copy[i] = this.safeClone(obj[i]);
                }
                return copy;
            }

            // File objects cannot be copied - so just return it.
            if (obj instanceof File) {
                return obj;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (let attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = this.safeClone(obj[attr]);
                    }
                }
                return copy;
            }

            throw new Error("MeshUtils#safeClone(): Unable to copy obj! Its type isn't supported.");
        }

        /**
         * Helper for filtering nodes by the display name against a string query.
         */
        public nodeFilterFn(node: INode, query: string): boolean {
            if (!query) {
                return true;
            }
            return -1 < node.fields[node.displayField].toLowerCase().indexOf(query.toLowerCase());
        }


        /**
         * Flatten an n-dimensional array.
         */
        public flatten(mdArray: any[]): any[] {
            var flatArray = [];

            if (!(mdArray instanceof Array)) {
                throw new Error('meshUtils#flatten: argument must be of type Array, got ' + typeof mdArray);
            }

            mdArray.forEach(item => {
                if (item instanceof Array) {
                    flatArray = flatArray.concat(this.flatten(item));
                } else {
                    flatArray.push(item);
                }
            });

            return flatArray;
        }

        /**
         * Generate a GUID
         */
        public generateGuid(): string {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        /**
         * From http://davidwalsh.name/javascript-debounce-function
         */
        public debounce(func: Function, wait: number, immediate?: boolean): Function {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }

        /**
         * Returns a function which can be used to generate predicate functions to be used with the
         * AngularJS "filter" filter: https://docs.angularjs.org/api/ng/filter/filter.
         *
         * By default, using the `item in collection | filter: query` expression will make Angular check
         * *all* properties of the `item` object. If we want to only filter by selected properties, we need to
         * write our own predicate function. The following function abstracts this step away and would be used like so:
         *
         * ```
         * // controller
         * public filterString: string; // data-bound to some UI input
         *
         * public myFilter = (value) => {
         *   return this.mu.matchProps(value, ['foo', 'bar'], this.filterString);
         * }
         * ```
         */
        public matchProps(obj: any, properties: string[], filterText: string): boolean {
            if (filterText === null || filterText === undefined) {
                return true;
            }
            for (let property of properties) {
                if (obj[property]) {
                    if (typeof obj[property] === 'string') {
                        let match = -1 < obj[property].toLowerCase().indexOf(filterText.toLowerCase());
                        if (match) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /**
         * Given an array of language codes (['de', 'fr', 'en', 'az']), sort them
         * alphabetically, placing the currentLang first if given.
         */
        sortLanguages(availableLangs: (string|ILanguageInfo)[], currentLang?: string): string[] {
            const sortCurrentLangFirst = (a: string, b: string) => {
                if (a === currentLang) {
                    return -1;
                } else if (b === currentLang) {
                    return 1;
                }
                return a < b ? -1 : 1;
            };
            const indentity = (x: string): string => x;
            const extractCode = (lang: ILanguageInfo): string => lang.code;
            const mapFn = typeof availableLangs[0] === 'string' ? indentity : extractCode;
            return availableLangs.map(mapFn).sort(sortCurrentLangFirst)
        }

        /**
         * Given a string value, append the suffix to the end.
         * If the value has periods in it (as in a file name), then insert
         * the suffix before the file extension:
         *
         * foo => foo_de
         * foo.html => foo.de.html
         */
        addSuffixToString(value: string, suffix: string, delimiter: string = '_'): string {
            let parts = value.split('.');
            if (1 < parts.length) {
                parts.splice(-1, 0, suffix);
                return parts.join('.');
            } else {
                return value + delimiter + suffix;
            }
        }

        /**
         * Clones a node and changes the fields which should be unique in a given parentNode (i.e. displayField,
         * segmentField) by adding a suffix.
         *
         * Returns a copy of the node passed in.
         */
        safeCloneNode(node: INode, schema: ISchema, suffix: string): INode {
            let nodeClone = angular.copy(node);
            let displayField = schema.displayField;
            let segmentField = schema.segmentField;

            if (typeof node.fields[displayField] === 'string') {
                nodeClone.fields[displayField] += ` (${suffix})`
            }
            if (segmentField && segmentField !== displayField && node.fields[segmentField]) {
                if (node.fields[segmentField].type === 'binary') {
                    nodeClone.fields[segmentField].fileName = this.addSuffixToString(node.fields[segmentField].fileName, suffix);
                } else if (node.fields[segmentField] !== undefined) {
                    nodeClone.fields[segmentField] = this.addSuffixToString(nodeClone.fields[segmentField], suffix);
                }
            }
 
            // Display a warning if there are any binary fields - these cannot be handled properly
            // until the dedicated translation endpoint is implemented in Mesh.
            let firstBinaryField = this.getFirstBinaryField(node);
            if (firstBinaryField.key !== undefined) {
                console.warn(`Note: binary fields cannot yet be copied.`);
            }

            return nodeClone;
        }
    }

    angular.module('meshAdminUi.common')
        .service('mu', MeshUtils);

}