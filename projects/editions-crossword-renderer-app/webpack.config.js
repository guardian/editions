const path = require('path')
const { crosswords } = require('../Mallard/html/manifest')

const HtmlWebPackPlugin = require('html-webpack-plugin')
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist/'),
        port: crosswords.watchPort,
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
    ],
}
