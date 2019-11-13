const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const mode = (process.env.NODE_ENV)?"production":"development";
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: mode,
    node:{
        fs:'empty'
    },
    output: {
        filename: 'core.js'
    },
    // optimization:{
    //     minimize: false,
    // },
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [["@babel/preset-env"]],
                    plugins: ['@babel/plugin-transform-runtime']
                  }
                }
              }
        ]
    },
    // plugins: [
    //     new VueLoaderPlugin()
    // ]
};