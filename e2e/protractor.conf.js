// Protrator end-to-end testing framework.
// For config options see https://github.com/angular/protractor/blob/master/docs/referenceConf.js
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['**/*.e2e.js'],
    rootElement: 'html'
};