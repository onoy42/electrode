"use strict";

const requireAt = require("require-at");
const archetype = require("../archetype");
const ck = require("chalker");
const optionalRequire = require("optional-require")(require);
const optFlow = optionalRequire("electrode-archetype-opt-flow");

const {
  enableTypeScript,
  flowRequireDirective,
  enableFlow,
  proposalDecorators,
  legacyDecorators,
  transformClassProps,
  looseClassProps,
  enableDynamicImport
} = archetype.babel;

const addFlowPlugin = Boolean(enableFlow && optFlow);
//
// Resolve full path of a plugin that's the dependency of host npm package
//
function getPluginFrom(host, pluginName) {
  return requireAt(require.resolve(`${host}/package.json`)).resolve(pluginName);
}

const basePlugins = [
  ...(enableDynamicImport
    ? ["@babel/plugin-syntax-dynamic-import", "@loadable/babel-plugin"]
    : [false]),
  // allow decorators on class and method
  // Note: This must go before @babel/plugin-proposal-class-properties
  (enableTypeScript || proposalDecorators) && [
    "@babel/plugin-proposal-decorators",
    { legacy: legacyDecorators }
  ],
  //
  // allow class properties. loose option compile to assignment expression instead
  // of Object.defineProperty.
  // Note: This must go before @babel/plugin-transform-classes
  //
  (enableTypeScript || transformClassProps) && [
    "@babel/plugin-proposal-class-properties",
    { loose: looseClassProps }
  ],
  [
    "babel-plugin-i18n-id-hashing",
    {
      varsContainingMessages: ["defaultMessages", "translations"]
    }
  ],
  [
    "babel-plugin-react-intl",
    {
      messagesDir: "./tmp/messages/",
      enforceDescriptions: true
    }
  ],
  "transform-node-env-inline",
  "babel-plugin-lodash",
  "@babel/plugin-transform-runtime",
  addFlowPlugin && [
    "@babel/plugin-transform-flow-strip-types",
    { requireDirective: flowRequireDirective }
  ]
];

const { BABEL_ENV, NODE_ENV } = process.env;

const fileId = "electrode-archetype-react-app-dev babelrc-client.js";

const checkEnv = names => {
  names = names.filter(x => !process.env.hasOwnProperty(x));
  if (names.length > 0) {
    console.error(ck`\n<red>ERROR: ${fileId}: env ${names.join(", ")} not defined</>`);
  }
};

checkEnv(["ENABLE_CSS_MODULE", "ENABLE_KARMA_COV"]);

const enableCssModule = process.env.ENABLE_CSS_MODULE === "true";
const enableKarmaCov = process.env.ENABLE_KARMA_COV === "true";
const isProduction = (BABEL_ENV || NODE_ENV) === "production";
const isTest = (BABEL_ENV || NODE_ENV) === "test";

const plugins = basePlugins.concat(
  // test env
  isTest && ["babel-plugin-dynamic-import-node"],
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
  // css module support
  enableCssModule && [
    [
      "babel-plugin-react-css-modules",
      {
        context: "./src",
        generateScopedName: `${isProduction ? "" : "[name]__[local]___"}[hash:base64:5]`,
        filetypes: {
          ".scss": {
            syntax: "postcss-scss",
            plugins: ["postcss-nested"]
          },
          ".styl": {
            syntax: "sugarss"
          },
          ".less": {
            syntax: "postcss-less"
          }
        }
      }
    ]
  ],
  enableKarmaCov && [getPluginFrom("electrode-archetype-opt-karma", "babel-plugin-istanbul")]
);

const targets = archetype.babel.envTargets[archetype.babel.target];
const coreJsVersion = archetype.devRequire("core-js/package.json").version.split(".")[0];
const useBuiltIns = archetype.babel.hasMultiTargets
  ? { useBuiltIns: "entry", corejs: coreJsVersion }
  : {};

const presets = [
  //
  // webpack 4 can handle ES modules now so turn off babel module transformation
  // in production mode to allow tree shaking.
  // But keep transforming modules to commonjs when not in production mode so tests
  // can continue to stub ES modules.
  //
  [
    "@babel/preset-env",
    {
      modules: isProduction || enableDynamicImport ? "auto" : "commonjs",
      loose: true,
      targets,
      ...useBuiltIns
    }
  ],
  enableTypeScript && "@babel/preset-typescript",
  "@babel/preset-react"
];

module.exports = {
  presets: presets.filter(x => x),
  plugins: plugins.filter(x => x)
};
