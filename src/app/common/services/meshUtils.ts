module meshAdminUi {

    /**
     * A collection of static utility methods for use throughout the app.
     */
    export class MeshUtils {

        /**
         * Given an object `item` with a `rolePerms` property of type ['create', 'read', 'update' 'delete'], this function
         * will return an object with each permission as a key set to `true`.
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
         * Takes a node and returns true is that node is a binary node and the associated binary is an image file.
         */
        public isImageNode(node: INode): boolean {
            if (typeof node.binaryProperties !== 'undefined') {
                return this.isImageMimeType(node.binaryProperties.mimeType);
            }
            return false;
        }

        public isImageMimeType(mimeType: string): boolean {
            return (/^image\//.test(mimeType));
        }

        /**
         * Deep clone an object, from http://stackoverflow.com/a/122190/772859
         * Note that this will not handle object containing circular references.
         *
         * @param obj
         * @returns {*}
         */
        private clone(obj) {
            if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
                return obj;

            var temp = obj.constructor();

            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj.isActiveClone = null;
                    temp[key] = this.clone(obj[key]);
                    delete obj.isActiveClone;
                }
            }

            return temp;
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
        };
    }

    angular.module('meshAdminUi.common')
           .service('mu', MeshUtils);

}