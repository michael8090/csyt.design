const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');

const nodeModules = {};
fs
    .readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {
        server: './src/server/index.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.sql$/,
                use: ['raw-loader'],
            },
            {
                test: /\.(sqlite)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: nodeModules,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../../build/server'),
    },
};
