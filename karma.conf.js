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
            'karma-es6-shim'
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
            //"Chrome", 
            'PhantomJS'
        ],
        // fix typescript serving video/mp2t mime type
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        webpack: { // packaging of the app before testing... 
            /*output: {
                filename: "[name].js" // cfr https://github.com/webpack/karma-webpack/issues/109
            },*/
            resolve: {
                root: path.resolve('./src'),
                extensions: ['', '.ts', '.js']
            },
            devtool: 'inline-source-map', //just do inline source maps instead of the default
            module: {
                loaders: [{
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.(less|scss|css)$/,
                    loader: 'ignore'
                }, // ignore inclusion of style files.
                ]
            },
            externals: { /// !!!! important !!!!
                'cheerio': 'window',
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            },
         
            plugins: [
                // ...
                function () {
                    this.plugin("done", function (stats) {
                        if (stats.compilation.errors && stats.compilation.errors.length) {
                            console.log(stats.compilation.errors);
                            process.exit(1);
                        }
                        // ...
                    });
                }
                // ...
            ]
        },

    });
};
