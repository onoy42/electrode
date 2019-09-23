"use strict";

/* eslint-disable max-statements, complexity */

const archetype = require("electrode-archetype-react-app/config/archetype");
const Path = require("path");
const detectCssModule = require("../util/detect-css-module");

const { getOptArchetypeRequire } = require("../../../lib/utils");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const autoprefixer = require("autoprefixer");
const cssLoader = require.resolve("css-loader");

// Stylus support
const optStylusRequire = getOptArchetypeRequire("electrode-archetype-opt-stylus");
const stylusLoader = optStylusRequire.resolve("stylus-relative-loader");

// SASS support
const optSassRequire = getOptArchetypeRequire("electrode-archetype-opt-sass");
const sassLoader = optSassRequire.resolve("sass-loader");

// LESS support
const optLessRequire = getOptArchetypeRequire("electrode-archetype-opt-less");
const lessLoader = optLessRequire.resolve("less-loader");

function loadPostCss() {
  const cssModuleRequire = getOptArchetypeRequire("electrode-archetype-opt-postcss");
  if (cssModuleRequire.invalid) {
    return { hasPostCss: false };
  }

  const atImport = cssModuleRequire("postcss-import");
  const postcssPresetEnv = cssModuleRequire("postcss-preset-env");
  const postcssLoader = cssModuleRequire.resolve("postcss-loader");

  return { hasPostCss: true, atImport, postcssPresetEnv, postcssLoader };
}

/*
 * CSS file type and support detection logic
 *
 * cssModuleSupport: false
 *
 * - *.css => normal CSS
 * - *.styl => stylus compiled to normal CSS
 * - *.scss => SASS compiled to normal CSS
 * - *.less => SASS compiled to normal CSS
 *
 * cssModuleSupport: true
 *
 * - *.css => CSS-Modules + CSS-Next
 * - *.styl => stylus compiled to normal CSS => CSS-Modules + CSS-Next
 * - *.scss => SASS compiled to normal CSS => CSS-Modules + CSS-Next
 * - *.less => LESS compiled to normal CSS => CSS-Modules + CSS-Next
 *
 * cssModuleSupport: undefined (default)
 *
 * - *only* *.css => cssModuleSupport sets to true
 * - *no* *.css (but *.styl or *.scss) => cssModuleSupport sets to false
 *
 * cssModuleSupport: array ["css", "styl", "scss", "less"]
 *
 * - individual extension enabled for CSS-Modules + CSS-Next
 */

module.exports = function() {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = !isProduction;

  const { hasPostCss, atImport, postcssPresetEnv, postcssLoader } = loadPostCss();

  const cssModuleSupport = hasPostCss && detectCssModule();
  const cssModuleStylusSupport = hasPostCss && archetype.webpack.cssModuleStylusSupport;

  const rules = [];

  /*
   * postcss Loader
   *
   * Note:
   * - webpack requires an identifier (ident) in options
   * when {Function}/require is used (Complex Options).
   */
  const getPostCssQuery = () =>
    hasPostCss && {
      loader: postcssLoader,
      options: {
        ident: "postcss",
        plugins: loader => [
          autoprefixer(),
          atImport({ root: loader.resourcePath }),
          postcssPresetEnv()
        ]
      }
    };

  /*
   * css-modules Loader
   */
  const getCSSModuleOptions = () => {
    const enableShortenCSSNames = archetype.webpack.enableShortenCSSNames;
    const enableShortHash = isProduction && enableShortenCSSNames;
    const localIdentName = `${enableShortHash ? "" : "[name]__[local]___"}[hash:base64:5]`;

    return {
      context: Path.resolve("src"),
      modules: true,
      localIdentName
    };
  };

  const getCssQueryUse = ext => {
    let cssModule = Boolean(cssModuleSupport);
    if (ext && Array.isArray(cssModuleSupport)) {
      cssModule = cssModuleSupport.indexOf(ext) >= 0;
    }

    return [
      cssModule
        ? { loader: cssLoader, options: getCSSModuleOptions() }
        : { loader: cssLoader, options: { minimize: true } },
      getPostCssQuery()
    ].filter(x => x);
  };

  const namePrefix = `extract-css${cssModuleSupport ? "-modules" : ""}`;

  /*
   * PLAIN css
   */
  rules.push({
    _name: namePrefix,
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
      },
      ...getCssQueryUse()
    ]
  });

  /*
   * SASS
   */
  if (archetype.options.sass && sassLoader) {
    rules.push({
      _name: `${namePrefix}-scss`,
      test: /\.(scss|sass)$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
        },
        ...getCssQueryUse().concat({ loader: sassLoader })
      ]
    });
  }

  /*
   * STYLUS
   */
  let stylusQuery;
  if (stylusLoader) {
    stylusQuery = { loader: stylusLoader };

    rules.push({
      _name: `${namePrefix}-stylus`,
      test: /\.styl$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
        },
        ...getCssQueryUse().concat(stylusQuery)
      ]
    });
  }

  /*
   *** cssModuleStylusSupport flag is about to deprecate. ***
   * If you want to enable stylus with CSS-Modules + CSS-Next,
   * Please use stylus as your style and enable cssModuleSupport flag instead.
   */
  if (!cssModuleSupport && cssModuleStylusSupport && hasPostCss && stylusQuery) {
    rules.push({
      _name: "extract-css-stylus-modules",
      test: /\.styl$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
        },
        { loader: cssLoader, options: getCSSModuleOptions() },
        getPostCssQuery(),
        stylusQuery
      ]
    });
  }

  /*
   * LESS
   */
  if (lessLoader) {
    rules.push({
      _name: `${namePrefix}-less`,
      test: /\.less$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: { hmr: isDevelopment, reload: isDevelopment, publicPath: "" }
        },
        ...getCssQueryUse().concat({ loader: lessLoader })
      ]
    });
  }

  return {
    module: { rules },
    plugins: [
      new MiniCssExtractPlugin({
        filename: archetype.babel.hasMultiTargets ? "[name].style.css" : "[name].style.[hash].css"
      }),
      isProduction && new OptimizeCssAssetsPlugin(archetype.webpack.optimizeCssOptions),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        options: { context: Path.resolve("src") }
      })
    ].filter(x => !!x)
  };
};
