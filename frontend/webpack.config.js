
const path = require("node:path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, "");

module.exports = {
  mode: "development",

  entry: "./src/index.jsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/[name].[contenthash].js",
    clean: true,
    publicPath: "/",
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },


module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      type: "javascript/auto",
      use: {
        loader: "babel-loader",
      },
    },
  ],
},


  plugins: [
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_BASE_URL": JSON.stringify(apiBaseUrl),
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],


devServer: {
  host: "localhost",
  port: 3000,
  open: true,
  hot: true,
  historyApiFallback: true,

  proxy: [
    {
      context: ["/api"],
      target: "http://localhost:8080",
    },
  ],
},
};
