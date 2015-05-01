
'use strict';

// Current Name of Application under test
exports.appName = 'Foo';

// URLs to test
exports.URL = {
    'init': 'http://localhost:8080',
    'home': 'http://localhost:8080'
};

// Mocha options for the integration runner
exports.mocha = {
    'ui':       'bdd',
    'timeout':  60000,
    // 'reporter': 'spec',
    'reporter': 'list'
};

// Cached reference to Selenium Server
exports.server = null;

// Cached reference to the selected Browser
exports.browser = null;

// Cached reference to the Selenium-Webdriver
exports.driver = null;
