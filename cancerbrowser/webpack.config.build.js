// webpack.config.js
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = [
  // Client build
  {
    entry: {
      'bundle.min': [
        'bootstrap-webpack!./bootstrap-client.config.js',
        'babel-polyfill',
        './client/index.jsx'
      ],
      'bundle': [
        'bootstrap-webpack!./bootstrap-client.config.js',
        'babel-polyfill',
        './client/index.jsx'
      ]
    },
    output: {
      path: './dist',
      filename: '[name].js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true
      })
    ],
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
          loader: 'babel-loader',
        },
        { test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        { test: /\.png$/,
          loader: "url-loader?limit=100000"
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
  },

  // Server build
  {
    plugins: [
      new ExtractTextPlugin("styles.css")
    ],
    entry: ['bootstrap-webpack!./bootstrap-server.config.js','./server/server.jsx'],
    target: 'node',
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    output: {
      path: './dist',
      filename: 'server.js',
    },
    externals: nodeModules,

    module: {
      loaders: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.json$/,
          // exclude: /node_modules/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("css-loader")
          // loader: ExtractTextPlugin.extract("css/locals?module")
          // loader: 'css/locals?module'
        },
        {
          test: /\.png$/,
          loader: "url-loader?limit=100000"
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
