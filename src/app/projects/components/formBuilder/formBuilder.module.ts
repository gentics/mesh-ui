module meshAdminUi {

    // headjs
    declare var head: any;

    let controls = meshConfig.microschemaControls;

    function customControlsLoader($compileProvider: ng.ICompileProvider) {
        const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

        if (controls) {
            let resources = controls.reduce((prev, curr) => {
                let files = ['js', 'css'].map(ext => `microschemaControls/${curr}.${ext}`);
                return prev.concat(files);
            }, []);

            head.load(resources, () => {
                if (meshMicroschemaControls) {
                    for(let controlName in meshMicroschemaControls) {
                        if (meshMicroschemaControls.hasOwnProperty(controlName)) {
                            let name = 'customControl' + capitalizeFirst(controlName);
                            let fn = meshMicroschemaControls[controlName];
                            console.log('registering directive', name);
                            $compileProvider.directive(name, fn);
                        }
                    }
                }
            });
        }
    }

    function customTemplatesLoader($templateRequest: ng.ITemplateRequestService) {
        if (controls) {
            controls.map(name => `../microschemaControls/${name}.html`)
                .forEach(url => {
                    console.log('$templateRequest getting', url);
                    $templateRequest(url);
                });
        }
    }

    angular.module('meshAdminUi.projects.formBuilder', ['dndLists'])
        .config(customControlsLoader)
        .run(customTemplatesLoader);
}