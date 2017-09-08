const merge = require('webpack-merge');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const common = require('./common.js');

module.exports = merge(common, {
  plugins: [
    new MinifyPlugin()
  ]
});