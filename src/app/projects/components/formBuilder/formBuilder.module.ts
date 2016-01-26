module meshAdminUi {

    // headjs is used to lazy-load the js and css for any custom microschema
    // controls defined in meshConfig.json.
    declare var head: any;

    // this module relies on a couple of global variables, so this is just
    // to stop the TypeScript compiler complaining.
    declare var meshConfig: any;
    declare var meshMicroschemaControls: any;

    let controls = meshConfig.microschemaControls;
    let controlsLocation = meshConfig.microschemaControlsLocation;

    /**
     * This function loads the .js and .css files associated with any custom microschema controls
     * defined in the meshConfig.microschemaControls array. The .js files should be AngularJS
     * directives which are then lazily registered with the app under the naming convention:
     *
     * "foo" -> "customControlFoo"
     */
    function customControlsResourceLoader($compileProvider: ng.ICompileProvider) {
        const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

        if (controls) {
            let resources = controls.reduce((prev, curr) => {
                let files = ['js', 'css'].map(ext => `${controlsLocation}/${curr}.${ext}`);
                return prev.concat(files);
            }, []);

            head.load(resources, () => {
                // the following expression is overly-complex because the phantomjs karma test runner
                // does not like me trying to access the value of an undefined variable (meshMicroschemaControls)
                // and causes an error which stops the unit tests. Doing `typeof` on it works ok though.
                var customControls = typeof meshMicroschemaControls === 'undefined' ?  {} : meshMicroschemaControls;

                for(let controlName in customControls) {
                    if (customControls.hasOwnProperty(controlName)) {
                        let name = 'customControl' + capitalizeFirst(controlName);
                        let fn = customControls[controlName];
                        $compileProvider.directive(name, fn);
                    }
                }
            });
        }
    }

    /**
     * Loads the template .html files for each registered microschema custom control via XHR and puts it
     * into the AngularJS template cache.
     */
    function customControlsTemplateLoader($templateRequest: ng.ITemplateRequestService, $sce: ng.ISCEService) {
        if (controls) {
            controls.map(name => `${controlsLocation}/${name}.html`)
                .forEach(url => $templateRequest($sce.trustAsResourceUrl(url)));
        }
    }

    angular.module('meshAdminUi.projects.formBuilder', [])
        .config(customControlsResourceLoader)
        .run(customControlsTemplateLoader);
}