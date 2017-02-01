"use strict";

var mergeWebpackConfig = require("webpack-partial").default;
var archetype = require("../../archetype");
var AppMode = archetype.AppMode;
var Path = archetype.Path;
var _ = require("lodash");

module.exports = function (babel) {
  // regex \b for word boundaries
  var babelExcludeRegex = new RegExp(`(node_modules|\\b${Path.join(AppMode.src.client, "vendor")}\\b)`);
  return function (config) {
    var hmr = process.env.HMR !== undefined;

    return mergeWebpackConfig(config, {
      module: {
        loaders: [
          {
            name: "babel",
            test: /\.jsx?$/,
            include: hmr && Path.resolve(AppMode.src.client),
            exclude: babelExcludeRegex,
            loaders: [
              hmr && "react-hot-loader",
              "babel-loader"
            ].filter(_.identity),
            query: babel
          },
          {
            name: "json",
            test: /\.json$/,
            loader: "json"
          }
        ]
      }
    });
  };
};
