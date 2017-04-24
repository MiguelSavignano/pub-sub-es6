const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {

  entry: [
    './src/pub-sub-es6',
  ],

  output : {
    filename : 'pub-sub-es6.js',
    path : path.resolve('./lib/'),
  },

  module : {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  },

  // plugins : [
  //   new UglifyJSPlugin()
  // ],
}

module.exports = config;