const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./common.js');

module.exports = merge(common, {
  entry: {

  },
  devtool: 'inline-source-map',
  watch: true,
  devServer: {
    hot: true,
    inline: true,
    contentBase: './build/client'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});