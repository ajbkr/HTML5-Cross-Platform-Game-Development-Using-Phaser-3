const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader'
      }]
    }, {
      test: /\.(gif|jpg|png|svg)$/,
      use: [
        'file-loader'
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html'
    })
  ]
}
