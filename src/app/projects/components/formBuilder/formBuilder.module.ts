module meshAdminUi {

    // headjs is used to lazy-load the js and css for any custom microschema
    // controls defined in meshConfig.json.
    declare var head: any;

    let controls = meshConfig.microschemaControls;

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
                let files = ['js', 'css'].map(ext => `microschemaControls/${curr}.${ext}`);
                return prev.concat(files);
            }, []);

            head.load(resources, () => {
                let meshMicroschemaControls = meshMicroschemaControls || {};
                for(let controlName in meshMicroschemaControls) {
                    if (meshMicroschemaControls.hasOwnProperty(controlName)) {
                        let name = 'customControl' + capitalizeFirst(controlName);
                        let fn = meshMicroschemaControls[controlName];
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
    function customControlsTemplateLoader($templateRequest: ng.ITemplateRequestService) {
        if (controls) {
            controls.map(name => `../microschemaControls/${name}.html`)
                .forEach(url => $templateRequest(url));
        }
    }

    angular.module('meshAdminUi.projects.formBuilder', ['dndLists'])
        .config(customControlsResourceLoader)
        .run(customControlsTemplateLoader);
}