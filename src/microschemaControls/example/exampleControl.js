/**
 * Microschema Custom Control Example
 * ==================================
 *
 * This is an annotated example which demonstrates the basic form of a Mesh custom microschema control.
 *
 * Imagine that we have a microschema named "example" with the following definition:
 *
 * ```
 * {
 *   "name": "example",
 *   "fields": [
 *     {
 *       "name": "filename",
 *       "label": "File name",
 *       "type": "string"
 *     },
 *     {
 *       "name": "size",
 *       "label": "Size (MB)",
 *       "type": "number"
 *     }
 *   ]
 * }
 * ```
 *
 * And in meshConfig.js we have:
 *
 * ```
 * microschemaControls: ["example/exampleControl"]
 * ```
 *
 * Here is how a custom control suitable for this microschema might look.
 */


/**
 * This global variable is required for the Mesh UI app to lazy-load the custom control.
 * Do not alter this line.
 */
var meshMicroschemaControls = meshMicroschemaControls || {};

/**
 * Put your code inside this IIFE.
 */
(function(meshMicroschemaControls) {

    /**
     * Here is the directive factory function itself. This is just a regular directive, so you can define it in any
     * way you like so long as it conforms to the AngularJS directive API: https://docs.angularjs.org/guide/directive
     */
    function exampleDirective() {

        function exampleLinkFn(scope, element) {
            /**
             * The scope object will contain an object named "fields", which represents the fields
             * defined by the microschema. Each of these fields implements the INodeFieldModel interface.
             * A partial description of this interface follows:
             *
             * ```
             * interface INodeFieldModel {
             *      // the following are as defined in the microschema definition object.
             *
             *      // The following properties are all taken directly from the field
             *      // definition in the microschema.
             *      name: string;
             *      type: string;
             *      label?: string;
             *      required?: boolean;
             *      defaultValue?: any;
             *      min?: number;
             *      max?: number;
             *      step?: number;
             *      options?: string[];
             *      allow?: string[];
             *      listType?: string;
             *
             *      // this is the actual value of the field. This is what you will be binding
             *      // to in your template.
             *      value: any;
             *
             *      // If canUpdate is false, your custom control inputs should be read only.
             *      canUpdate: boolean;
             *
             *      // The update function is used to update the value of this field in the editor component.
             *      // That is to say, simply updating the `value` will only change the local value, and will
             *      // not update the node itself. When a change is made, you must explicitly call the
             *      // `update()` method and pass the new value as the only argument.
             *      update: (value: any) => void;
             * }
             */


            /**
             * Here is the actual logic for the example control. All it does is convert the file size in bytes
             * into a value in MB (mebibytes) which is then displayed to the user. Then the value is changed, we convert
             * back to bytes in order to update the real value of the field.
             */
            var FACTOR = 1024 * 1024;

            /**
             * Converts a number in bytes to the equivalent in mebibytes (MiB), rounded to 2 decimal places.
             */
            function bytesToMB(bytes) {
                return +(bytes / FACTOR).toFixed(2);
            }

            scope.sizeInMiB = bytesToMB(scope.fields.size.value);

            /**
             * A generic update function which should be used when no special conversion logiv is needed - it simply
             * delegates to the `update()` method of the NodeFieldModel.
             *
             * @param {INodeFieldModel} field - the field to be updated
             */
            scope.update = function(field) {
                field.update(field.value);
            };

            /**
             * This is an example of a custom update function, whereby we perform a conversion from MiB to bytes and
             * pass the result to the sizeField's update() method.
             * @param {INodeFieldModel} sizeField
             * @param {number} sizeInMiB
             */
            scope.updateSize = function(sizeField, sizeInMiB) {
                sizeField.update(sizeInMiB * FACTOR);
            };
        }

        return {
            // Restrict *must* be set to 'E'.
            restrict: 'E',
            // In this example we are just using the link function, but you are free to use a
            // combination of link, compile and controller as you wish.
            link: exampleLinkFn,
            // The templateUrl *must* follow this form, i.e. it must start with the string
            // "../microschemaControls/", followed by the path defined in meshConfig, followed
            // by the ".html" extension.
            templateUrl: '../microschemaControls/example/exampleControl.html',
            // do not use an isolated scope in this case. The proxy directive does this for
            // you, so doing so here will prevent this directive from having access to the
            // field values.
            scope: false
        };
    }

    // Finally, we need to register our custom directive by adding it as a new property on the
    // `meshMicroschemaControls` object. The property name *must* correspond to the microschema
    // name. You can potentially register the control for multiple microschema names by adding
    // it under multiple property keys.
    meshMicroschemaControls.example = exampleDirective;

}(meshMicroschemaControls));