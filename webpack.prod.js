const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',

  mode: 'production',

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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },

  plugins: [
    new webpack.ProgressPlugin(),

    new HtmlWebpackPlugin({
      title: 'Imagist',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),

    new MiniCssExtractPlugin(),

    new CopyPlugin({
      patterns: [
        { from: "./src/assets", to: "./assets" },
      ],
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },

  resolve: {
    extensions: [".js", ".jsx", ".css"],
  }
}