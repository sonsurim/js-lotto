const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devServer: {
    port: 9000
  },
  entry: ['./src/js/step3-index.js', './src/css/index.css'],
  output: {
    filename: 'step3-bundle.js',
    path: path.resolve(__dirname, 'docs')
  },
  resolve: {
    extensions: ['.js', '.mjs', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devtool: 'inline-source-map'
}
