var path = require('path');

module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "es6-shim"],

        files: [{
            pattern: "src/**/*.spec.ts"
        }],

        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-edge-launcher',
            'karma-junit-reporter',
            'karma-es6-shim',
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*.spec.ts': ['webpack', 'sourcemap']
        },

        reporters: ["progress", "junit"],

        junitReporter: {
            outputDir: 'test-results/', // results will be saved as $outputDir/$browserName.xml
            outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {} // key value pair of properties to add to the <properties> section of the report
        },

        browsers: [
            //'Edge',
            // "Chrome",
            "MyHeadlessChrome"
            // 'PhantomJS'
        ],

        customLaunchers: {
            MyHeadlessChrome: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        // fix typescript serving video/mp2t mime type
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        webpack: require('./webpack.config.js'),
    });
};
