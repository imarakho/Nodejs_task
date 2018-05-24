var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var UglifyJS = require("uglify-es");

module.exports = {
    entry: {
        main: './static/src/main.js',
    },
    output: {
        path: path.resolve('./static/static/bundles/'),
        filename: "[name].js",
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new BundleTracker({filename: './webpack-stats.json'}),
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ])
}