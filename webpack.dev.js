const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const FlowWebpackPlugin = require('flow-webpack-plugin');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    overlay: true
  },
  plugins: [
    new FlowWebpackPlugin({
      flowArgs: []
    })
  ]
});
