"use strict";

const archetype = require("@xarc/app/config/archetype");
const IsomorphicLoaderPlugin = require("isomorphic-loader/lib/webpack-plugin");
const isomorphicConfig = require("isomorphic-loader/lib/config");
const Path = require("path");
const { babel } = archetype;

module.exports = function(opts) {
  const target = babel.target !== "default" ? `-${babel.target}` : "";
  const configFile = Path.resolve(isomorphicConfig.configFile.replace(".json", `${target}.json`));
  return {
    plugins: [
      new IsomorphicLoaderPlugin({
        configFile,
        assetsFile: opts.assetsFile || "../isomorphic-assets.json",
        webpackDev: {
          url: `http://${archetype.webpack.devHostname}:${archetype.webpack.devPort}`,
          addUrl: false
        }
      })
    ]
  };
};
