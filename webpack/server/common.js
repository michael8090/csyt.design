const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');

const  nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: {
    server: './src/server/index.ts'
  },
  module: {
      rules: [
          {
              test: /\.tsx?$/,
              use: [
                  'babel-loader',
                  'ts-loader'
              ]
          }
      ]
  },
  target: 'node',
  externals: nodeModules,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../build/server')
  }
};