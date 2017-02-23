"use strict";

const ispartaLoader = require.resolve("isparta-loader");
const mergeWebpackConfig = require("webpack-partial").default;

module.exports = function () {
  return function (config) {
    return mergeWebpackConfig(config, {
      module: {
        rules: [
          // Manually instrument client code for code coverage.
          // https://github.com/deepsweet/isparta-loader handles ES6 + normal JS.
          {
            test: /(test|client)\/.*\.jsx?$/,
            enforce: "pre",
            exclude: /(node_modules|\bclient\/vendor\b)/,
            loader: ispartaLoader
          }
        ]
      }
    });
  };
};
