"use strict";

const requireAt = require("require-at");

function getPluginFrom(host, pluginName) {
  return requireAt(require.resolve(`${host}/package.json`)).resolve(pluginName);
}

const basePlugins = [
  "@babel/plugin-proposal-object-rest-spread",
  "babel-plugin-lodash",
  "@babel/plugin-transform-runtime",
  "@babel/plugin-transform-flow-strip-types"
];

const { BABEL_ENV, NODE_ENV } = process.env;

const enableKarmaCov = process.env.ENABLE_KARMA_COV === "true";
const isProduction = (BABEL_ENV || NODE_ENV) === "production";
const isTest = (BABEL_ENV || NODE_ENV) === "test";

const plugins = basePlugins.concat(
  // test env
  isTest && ["babel-plugin-dynamic-import-node"],
  // i18n
  [
    [
      "babel-plugin-react-intl",
      {
        messagesDir: "./tmp/messages/",
        enforceDescriptions: true
      }
    ]
  ],
  // production env
  isProduction && [
    "@babel/plugin-transform-react-constant-elements",
    [
      "babel-plugin-transform-react-remove-prop-types",
      {
        removeImport: true
      }
    ]
  ],
  enableKarmaCov && [getPluginFrom("electrode-archetype-opt-karma", "babel-plugin-istanbul")]
);

module.exports = {
  presets: [["@babel/preset-env", { loose: true }], "@babel/preset-react", "@babel/preset-flow"],
  plugins: plugins.filter(x => x)
};
