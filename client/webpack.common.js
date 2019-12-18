const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './components/index.js',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Bowdown',
            favicon: './images/bow-and-arrow.png'
        }),
        new HtmlWebpackRootPlugin('app')
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(wav|png|svg|jpg|gif|glb|gltf|bin|mp3)$/,
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                },
            }
        ]
  }
};