var webpack = require('webpack');
module.exports = {
    entry:"./js/app.js" ,
    output: {
        path: './build/',
        filename: "build.js"
    },
    module: {
        rules: [
            //.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            //.js 文件使用 jsx-loader 来编译处理
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ],

    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({//利用webpack自带的代码压缩功能压缩代码
            compress: {
                warnings: false
            }
        })
    ]


};