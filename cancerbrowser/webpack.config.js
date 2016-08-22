// webpack.config.js
var webpack = require('webpack');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = [
  // Client build
  {
    plugins: [
      // Note: the HtmlPlugin automatically adds the needed css and js to the html file
      new HtmlPlugin({
        template: './common/index.html',
        filename: 'index.html'
      })
    ],
    devtool: 'eval-cheap-module-source-map',
    entry: {
      'bundle': [
        'babel-polyfill',
        './client/index.jsx'
      ]
    },
    output: {
      path: './dist',
      filename: '[name].js',
      publicPath: '/'
    },
    module: {
      loaders: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        { test: /\.(css|scss)$/,
          loader: 'style-loader!css-loader!sass-loader'
        },
        { test: /\.(png|jpg)$/,
          loader: 'file-loader?name=img/[hash].[ext]'
        },
        { test: /\.tsv$/,
          loader: 'file-loader?name=data/[hash].[ext]'
        },
        // Bootstrap
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'},
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file'
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json']
    }
  }
];
