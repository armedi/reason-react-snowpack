const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env'),
});

// this webpack configuration is only used for production

const ssgConfig = fs.existsSync('./ssg.config.js')
  ? require('./ssg.config.js')
  : { routes: ['/'] };

module.exports = {
  mode: 'production',
  bail: true,
  output: {
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
    globalObject: 'this',
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // because snowpack use this import.meta.env for environment variables
      'import.meta.env': JSON.stringify({
        ...dotenv.parsed,
        NODE_ENV: 'production',
        MODE: 'production',
      }),
    }),
    ...ssgConfig.routes.map(
      (route) =>
        new HtmlWebpackPlugin({
          inject: true,
          filename: path.join(route.replace(/^\//, ''), 'index.html'),
          template: 'public/indexProduction.html',
          templateParameters: {
            REACT_ROOT: execSync(`node scripts/renderToString ${route}`),
          },
        })
    ),

    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index*.html'],
          },
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
    }),
  ],
};
