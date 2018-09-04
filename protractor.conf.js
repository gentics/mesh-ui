// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  suites: {
    browser: 'e2e/tests/node-browser.e2e-spec.ts',
    editor: 'e2e/tests/node-editor.e2e-spec.ts',
    list: 'e2e/tests/node-list.e2e-spec.ts',
    admin: 'e2e/tests/node-admin.e2e-spec.ts',
    schema: 'e2e/tests/node-schema.e2e-spec.ts',
    microschema: 'e2e/tests/node-microschema.e2e-spec.ts',
    nodefield: 'e2e/tests/node-field.e2e-spec.ts'
  },
  capabilities: {
    'browserName': 'chrome'
  },
  SELENIUM_PROMISE_MANAGER: false,
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
