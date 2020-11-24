/* eslint-disable @typescript-eslint/no-var-requires */

import * as Path from "path";
import { loadXarcOptions } from "../util/load-xarc-options";

module.exports = () => {
  const xarcOptions = loadXarcOptions();
  const AppMode = xarcOptions.AppMode;
  const xarcCwd = xarcOptions.cwd;
  const clientDllConfig = require(Path.resolve(xarcCwd, AppMode.src.client, "dll.config.js"));

  return {
    entry: clientDllConfig
  };
};
