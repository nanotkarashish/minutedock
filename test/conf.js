exports.config = {
  seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar",
  seleniumPort: 4444,
  chromeDriver: 'node_modules/protractor/selenium/chromedriver',
  chromeOnly: false,
  seleniumArgs: [],

  allScriptsTimeout: 11000,

  specs: [
    'specs/**/*Spec.js',
  ],

  exclude: [],

  suites: {
    single: 'specs/searchSpec.js',
    full: 'specs/**/*Spec.js'
  },

  capabilities:   {
    'browserName': 'chrome'
  },

  multiCapabilities: [],

  baseUrl: 'do not use',

  rootElement: 'body',

  onPrepare: "setUp/protractorOnPrepare.js",
  params: {
    loginCookie : 's:j:{"passport":{"user":"dd7e10bb-7df3-4f2f-b2c5-8ed1da2d255c"}}.9T315i5t70DTjYLD0DB4tX2ssJI2vaIXkvlb8hvZVSI'
  },

  framework: 'jasmine',
  
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  },
  onCleanUp: function() {
    
  }
};