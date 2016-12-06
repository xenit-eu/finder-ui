var path = require('path');

module.exports = function (config) {
    config.set({

        frameworks: ["jasmine"],

        files: [
            { pattern: "src/**/*.spec.ts" }
        ],

        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-edge-launcher',
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*.spec.ts': ['webpack', 'sourcemap']
        },

        reporters: ["progress"],

        browsers: [
            //'Edge',
            //"Chrome", 
            'PhantomJS'
        ],


        webpack: {  // packaging of app before testing... 
            /*output: {
                filename: "[name].js" // cfr https://github.com/webpack/karma-webpack/issues/109
            },*/
            resolve: {
                root: path.resolve('./src'),
                extensions: ['', '.ts', '.js']
            },
            devtool: 'inline-source-map', //just do inline source maps instead of the default
            module: {
                loaders: [
                    { test: /\.tsx?$/,      loader: 'awesome-typescript-loader' },
                    //{ test: /\.css$/,       loader: "style!css" },
                    //{ test: /\.scss$/,      loaders: ["style-loader", "css-loader", "sass-loader"] },
                    { test: /\.(less|scss|css)$/,      loader: 'ignore' },
                    
                ]
            },
            externals: { /// !!!! important !!!! 
                'cheerio': 'window',
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            }
        },

    });
};