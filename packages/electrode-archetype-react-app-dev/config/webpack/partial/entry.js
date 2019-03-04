"use strict";

const Fs = require("fs");
const _ = require("lodash");
const optionalRequire = require("optional-require")(require);
const Path = require("path");
const archetype = require("electrode-archetype-react-app/config/archetype");
const AppMode = archetype.AppMode;
const chalk = require("chalk");

let context = Path.resolve(AppMode.src.client);
const polyfill = archetype.webpack.enableBabelPolyfill;

const logger = require("electrode-archetype-react-app/lib/logger");

//
// Look for src/client/entry.config.js, which should export the entry field
// for the webpack config.  It can be an object that specifies multiple
// entries, or a string that points the file for entry
//
function searchEntryConfig() {
  /*
   * Allow an application to opt in for *multiple* entry points and consequently for
   * multiple bundles in the app by placing `bundle.config.js` in application root
   * directory.
   *
   * If you need to set something like __webpack_public_path__, then your entry file
   * must be vanilla JS because webpack can only process those, so support having a
   * vanilla JS file as entry.
   */
  const entryPath = Path.join(context, "entry.config.js");

  const entry = optionalRequire(entryPath, {
    fail: err => {
      logger.error(`Loading ${entryPath} failed`, err);
      process.exit(1);
    },
    notFound: () => logger.info(`No custom entry point configuration ${entryPath}`)
  });

  if (entry) {
    logger.info(`Using custom entry config from ${entryPath}`);
  }

  return entry;
}

//
// Look for src/client/<name>/subapp.js files.  If found, then assume app follows
// the subapp architecture, and automatically generate one entry for each subapp.
//
function searchSubApps() {
  const subApps = AppMode.subApps;

  if (_.isEmpty(subApps)) {
    logger.info(`No subapps found under ${AppMode.src.dir}`);
    return false;
  } else {
    logger.info(`Found subapps: ${Object.keys(subApps).join(", ")}`);
  }

  context = Path.resolve(AppMode.src.dir);
  const entry = {};
  _.each(subApps, ma => {
    const entryName = `${ma.name.toLowerCase()}`;
    const x1 = `${chalk.magenta("subapp")} ${chalk.blue(ma.name)}`;
    entry[entryName] = `./${Path.join(ma.subAppDir, ma.entry)}`;
    logger.info(`${x1} entry ${entry[entryName]}`);
  });

  return entry;
}

function appEntry() {
  // App has src/client/entry.config.js?
  const entryConfig = searchEntryConfig();
  if (entryConfig) return entryConfig;

  if (archetype.options.subapp !== false) {
    // App has subapp apps within src?
    const subApps = searchSubApps();
    if (subApps) {
      return subApps;
    }
  } else {
    logger.info(`subapp turned off by archetypeConfig.options.subapp flag`);
  }

  // finally look for src/client/app.js or src/client/app.jsx or src/client/app.tsx
  const entries = ["./app.js", "./app.jsx", "./app.tsx"];
  const entry = entries.find(f => Fs.existsSync(Path.join(context, f))) || "./app.jsx";
  logger.info(`Default to single app entry point using ${entry} under context ${context}`);

  return entry;
}

const entry = polyfill ? { main: ["@babel/polyfill", appEntry()] } : appEntry();

module.exports = {
  context,
  entry
};
