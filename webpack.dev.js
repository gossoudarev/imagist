const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 1111,
  },

  plugins: [
    new webpack.ProgressPlugin(),

    new HtmlWebpackPlugin({
      title: 'Imagist',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],

  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },

  devtool: 'source-map',
}