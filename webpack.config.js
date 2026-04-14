const path = require('path');
const webpack = require('webpack');
const WranglerPlugin = require('wrangler-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './_worker.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'worker.js'
  },
  target: 'webworker',
  plugins: [
    new WranglerPlugin()
  ],
  resolve: {
    extensions: ['.js']
  }
};
