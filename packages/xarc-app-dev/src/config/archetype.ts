/* eslint-disable @typescript-eslint/no-var-requires, max-statements, no-console */

import { XarcOptions } from "./opt2/xarc-options";
import { getDevArchetypeLegacy } from "./options";
const _ = require("lodash");
const getEnvProxy = require("./env-proxy");
import { saveXarcOptions, loadXarcOptions } from "../lib/utils";

let cachedArchetype = null;

/**
 * Get development options
 *
 * @param user - user options
 * @returns options - final options with defaults and env applied
 */
module.exports = function getDevOptions(userOptions: XarcOptions = null) {
  if (!userOptions && cachedArchetype) {
    // if cached is already running
    cachedArchetype._fromCache = true;
    // maintained for backwards compatibility
    return cachedArchetype;
  }

  // first get legacy configs
  const legacy = getDevArchetypeLegacy();

  // try to read xarc-options.json if it exist and merge it into legacy
  const xarcOptions = userOptions
    ? {}
    : {
        ...loadXarcOptions(process.env.XARC_CWD || process.cwd(), false),
        // don't want these from saved options because the calculated ones in
        // legacy is most up to date.  otherwise an outdated saved options
        // will break everything if dependencies were updated
        dir: undefined,
        devDir: undefined,
        config: undefined,
        cwd: undefined // we know what this is already
      };

  userOptions = _.merge({}, xarcOptions, userOptions);

  //checking for cwd from xclap or from env
  const cwd = userOptions.cwd || process.env.XARC_CWD || process.cwd();
  process.env.XARC_CWD = cwd;

  const proxy = getEnvProxy();

  // proxy config was not set in legacy, so add to top level here
  _.merge(legacy, proxy);

  // merge user.webpackOptions into legacy.webpack
  _.merge(legacy.webpack, userOptions.webpackOptions);
  // merge user.babelOptions into legacy.babel
  _.merge(legacy.babel, userOptions.babelOptions);
  // merge user.addOnFeatures into legacy.options
  _.merge(legacy.options, userOptions.addOnFeatures);
  // merge the rest into top level
  _.merge(legacy, {
    ...userOptions,
    cwd,
    webpackOptions: undefined,
    babelOptions: undefined,
    addOnFeatures: undefined
  });

  // if user's options exist, it means this is invoked by user passing in options
  // the first time, so save it.
  if (userOptions) {
    saveXarcOptions(legacy);
  }

  cachedArchetype = legacy;

  return cachedArchetype;
};
