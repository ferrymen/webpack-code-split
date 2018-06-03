const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    nintendo: path.resolve(__dirname, 'src/js/nintendo.jsx'),
    sony: path.resolve(__dirname, 'src/js/sony.jsx'),
    microsoft: path.resolve(__dirname, 'src/js/microsoft.js'),
    vender: ['react', 'react-dom']
  },
  module: {
    rules: [{
      test: /\.(jsx|js)$/,
      exclude: /(node_modules)/,
      use: ['babel-loader']
    }, {
      test: /\.css$/,
      include: path.resolve(__dirname, 'src/css'),
      use: ExtractTextWebpackPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash:7].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,
      names: ['vender', 'manifest']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/[name].[chunkhash:7].js',
      chunks: ['nintendo', 'sony', 'microsoft']//从'nintendo','sony', 'microsoft'中抽取commons chunk
    }),
    
    new ExtractTextWebpackPlugin({
      filename:  (getPath) => {
        var _filename = getPath('css/[name].[chunkhash:7].css');
        if (/common\..*\.css/.test(_filename)) {
          _filename = _filename.replace('css/', 'common/css/')
        }
        return _filename;
      },
    }),
    new HtmlWebpackPlugin({
      chunks: ['manifest', 'vender', 'common', 'nintendo'],
      chunksSortMode: 'manual',
      filename: 'html/nintendo.html',
      title: 'Hello Nintendo',
      minify: {
        collapseWhitespace: false,
        removeComments: true
      },
      template: path.resolve(__dirname, 'src/html/base.html')
    }),
    new HtmlWebpackPlugin({
      chunks: ['manifest', 'vender', 'common', 'sony'],
      chunksSortMode: 'manual',
      filename: 'html/sony.html',
      title: 'Hello Sony',
      minify: {
        collapseWhitespace: false,
        removeComments: true
      },
      template: path.resolve(__dirname, 'src/html/base.html')
    }),
    new HtmlWebpackPlugin({
      chunks: ['manifest', 'vender', 'common', 'microsoft'],
      // chunksSortMode: 'manual',
      chunksSortMode: function (chunk1, chunk2) {
        var order = ['manifest', 'vender', 'common', 'microsoft'];
        var order1 = order.indexOf(chunk1.names[0]);
        var order2 = order.indexOf(chunk2.names[0]);
        return order1 - order2;  
      },
      filename: 'html/microsoft.html',
      title: 'Hello Microsoft',
      minify: {
        collapseWhitespace: false,
        removeComments: true
      },
      template: path.resolve(__dirname, 'src/html/base.html')
    })
  ]
};
