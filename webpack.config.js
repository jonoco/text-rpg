const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  target: 'node',
  devtool: 'inline-source-map',
  node: {
    fs: 'empty',
    child_process: 'empty',
    readline: 'empty'
  }
};