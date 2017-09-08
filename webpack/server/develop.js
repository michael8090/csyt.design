const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  watch: true,
  devServer: {
    contentBase: './build/server'
  }
});