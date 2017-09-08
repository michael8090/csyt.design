const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    client: './src/client/index.ts'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'csyt.design'
    })
  ],
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
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../build/client')
  }
};