// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const customMatchers = require('./e2e/custom-matchers');

exports.config = {
  allScriptsTimeout: 11000,
  suites: {
    browser: 'e2e/tests/node-browser.e2e-spec.ts',
    list: 'e2e/tests/node-list.e2e-spec.ts',
    admin: 'e2e/tests/node-admin.e2e-spec.ts',
    schemaEditor: 'e2e/tests/schema-editor.e2e-spec.ts',
    microschemaEditor: 'e2e/tests/microschema-editor.e2e-spec.ts',
    schema: 'e2e/tests/node-schema.e2e-spec.ts',
    microschema: 'e2e/tests/node-microschema.e2e-spec.ts',
    nodeEditor: 'e2e/tests/node-editor.e2e-spec.ts',
    nodefield: 'e2e/tests/node-field.e2e-spec.ts',
    nodelistfield: 'e2e/tests/node-list-field.e2e-spec.ts',
    nodebrowserlist: 'e2e/tests/node-browser-list.e2e-spec.ts',
    nodePublish: 'e2e/tests/node-publish.e2e-spec.ts',
    groupAdmin: 'e2e/tests/group-admin.e2e-spec.ts',
    roleAdmin: 'e2e/tests/role-admin.e2e-spec.ts'
  },
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--window-size=1920,1080']
    }
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
  async onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    beforeEach(() => {
      jasmine.addMatchers(customMatchers);
    })
    
    // Workaround for https://github.com/angular/protractor/issues/2227
    require("protractor").ElementArrayFinder.prototype.map = function(mapFn) {
      return this.reduce((arr, el) => arr.concat(mapFn(el, arr.length)), []);
    };
    
    // Check if already logged-in to avoid wasting time
    await browser.get('/#/editor/project');
    const navTop = element(by.tagName('gtx-top-bar'));
    if (navTop.isPresent()) {
      console.log('Already logged-in. Skipping login process.');
    } else {
      console.log('Not logged-in. Logging in...');
      await browser.get('/#/login');
      await element(by.css('input[name="username"]')).sendKeys('admin');
      await element(by.css('input[name="password"]')).sendKeys('admin');
      await element(by.tagName('button')).click();
    }
    // This seems to be necessary sometimes
    await browser.waitForAngular();
    
  }
};
