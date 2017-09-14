const merge = require('webpack-merge');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const common = require('./common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    plugins: [new webpack.HashedModuleIdsPlugin(), new MinifyPlugin()],
    output: {
        filename: '[name].[chunkhash].js',
    },
});
