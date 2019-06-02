var path = require('path');
var BUILD = path.resolve(__dirname, 'dist');
var SRC = path.resolve(__dirname, 'src');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    entry: SRC + '/js/javascript.js',
    devServer: {
      contentBase: '/',
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [{loader: MiniCssExtractPlugin.loader},{loader:'css-loader'}]
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename:"bundle.css"
        })
      ],
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
    output: {
      path: BUILD,
      filename: 'bundle.js', 
      publicPath:'/'    
    },
    
  };