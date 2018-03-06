"use strict";

const Path = require("path");
const glob = require("glob");
const optionalRequire = require("optional-require")(require);

const atImport = require("postcss-import");
const cssnext = require("postcss-cssnext");
const webpack = require("webpack");

const styleLoader = require.resolve("style-loader");
const cssLoader = require.resolve("css-loader");
const postcssLoader = require.resolve("postcss-loader");
const stylusLoader = require.resolve("stylus-relative-loader");
const sassLoader = require.resolve("sass-loader");

const demoAppPath = Path.resolve(process.cwd(), "..", "..", "demo-app");
const archetypeAppPath = Path.resolve(demoAppPath, "archetype", "config");

const archetypeApp = optionalRequire(archetypeAppPath) || { webpack: {} };
const archetypeAppWebpack = archetypeApp.webpack;
let cssModuleSupport = archetypeAppWebpack.cssModuleSupport;
const cssModuleStylusSupport = archetypeAppWebpack.cssModuleStylusSupport;

/*
 * cssModuleSupport: false
 * case 1: *only* *.css => normal CSS
 * case 2: *only* *.styl exists => Stylus
 * case 3: *only* *.scss exists => SASS
 *
 * cssModulesSupport: true
 * case 1: *only* *.css => CSS-Modules + CSS-Next
 * case 2: *only* *.styl => normal CSS => CSS-Modules + CSS-Next
 * case 3: *only* *.scss => normal CSS => CSS-Modules + CSS-Next
 */

const cssLoaderOptions =
  "?modules&localIdentName=[name]__[local]___[hash:base64:5]&-autoprefixer";
const cssQuery = `${cssLoader}!${postcssLoader}`;
const stylusQuery = `${cssLoader}?-autoprefixer!${stylusLoader}`;
const scssQuery = `${cssQuery}!${sassLoader}`;
const cssModuleQuery = `${cssLoader}${cssLoaderOptions}!${postcssLoader}`;
const cssStylusQuery = `${cssLoader}${cssLoaderOptions}!${postcssLoader}!${stylusLoader}`;
const cssScssQuery = `${cssLoader}${cssLoaderOptions}!${postcssLoader}!${sassLoader}`;

const cssExists =
  glob.sync(Path.resolve(process.cwd(), "src/styles", "*.css")).length > 0;
const stylusExists =
  glob.sync(Path.resolve(process.cwd(), "src/styles", "*.styl")).length > 0;
const scssExists =
  glob.sync(Path.resolve(process.cwd(), "src/styles", "*.scss")).length > 0;

const rules = [];

/*
 * cssModuleSupport default to undefined
 *
 * when cssModuleSupport not specified:
 * *only* *.css, cssModuleSupport sets to true
 * *only* *.styl, cssModuleSupport sets to false
 * *only* *.scss, cssModuleSupport sets to false
 */
if (cssModuleSupport === undefined) {
  cssModuleSupport = cssExists && !stylusExists && !scssExists;
}

module.exports = function() {
  rules.push(
    {
      test: /\.css$/,
      use: cssModuleSupport ? cssModuleQuery : cssQuery
    },
    {
      test: /\.scss$/,
      use: cssModuleSupport ? cssScssQuery : scssQuery
    },
    {
      test: /\.styl$/,
      use: cssModuleSupport ? cssStylusQuery : stylusQuery
    }
  );

  /*
  *** cssModuleStylusSupport flag is about to deprecate. ***
  * If you want to enable stylus with CSS-Modules + CSS-Next,
  * Please use stylus as your style and enable cssModuleSupport flag instead.
  */
  if (cssModuleStylusSupport) {
    rules.push({
      test: /\.styl$/,
      use: cssStylusQuery
    });
  }

  return {
    module: { rules },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: () => {
            return cssModuleSupport
              ? [
                  atImport,
                  cssnext({
                    browsers: ["last 2 versions", "ie >= 9", "> 5%"]
                  })
                ]
              : [];
          },
          stylus: {
            use: !cssModuleSupport ? [
                autoprefixer({
                  browsers: ["last 2 versions", "ie >= 9", "> 5%"]
                })
              ]
            : [],
            define: {
              $tenant: process.env.ELECTRODE_TENANT || "walmart"
            }
          }
        }
      })
    ].filter(x => !!x)
  };
};
