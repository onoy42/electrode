"use strict";
/**
 * Webpack browser coverage configuration
 */
const baseProfile = require("./profile.base");
const generateConfig = require("./util/generate-config");
const Path = require("path");

function makeConfig() {
  const browserCoverageProfile = {
    partials: {
      "_dev-mode": { order: 10000 },
      _uglify: { order: 10100 },
      _locales: { order: 10200 },
      _coverage: { order: 10300 },
      "_sourcemaps-inline": { order: 10400 }
    }
  };

  const options = {
    profiles: {
      _base: baseProfile,
      "_browser-coverage": browserCoverageProfile
    },
    profileNames: ["_base", "_browser-coverage"],
    configFilename: Path.basename(__filename)
  };

  return generateConfig(options);
}

module.exports = makeConfig();
