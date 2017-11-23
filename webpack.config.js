var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    quiet: true, // lets WebpackDashboard do its thing
    entry: ["whatwg-fetch", "./src/index.ts"],  // whatwg-fetch to be added because missing in IE11
    output: {
        path: __dirname + '/build/',
        filename: "bundle.js"
    },
    devtool: 'source-map',
    devServer: {
        port: 8088,
        contentBase: './build/',
        historyApiFallback: true
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.ts', '.js']
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|fr|nl/), // avoid that moment loads all locals (only needed languages)
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.json$/, loader: "json" },
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
        ]
    },
    node: {
    }
};
