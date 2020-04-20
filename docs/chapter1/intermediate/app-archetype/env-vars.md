# Environment Variables

Some of the app archetype's features can be controlled by environment variables.

## General Electrode Feature Configurations

| Variable            | Description                                                                                            |   Default   |
| ------------------- | :----------------------------------------------------------------------------------------------------- | :---------: |
| `PORT`              | The port number your app's `config/default.js` will read from to start up your app server to listen at |   `3000`    |
| `INSPECTPACK_DEBUG` | If set to `true`, generates stats for used with the [inspectpack] tool                                 | `undefined` |
| `DEV_ADMIN_LOG_LEVEL`          | When using the dev admin server, "0" shows all console log lines by default, and "1" displays only warning and error console log lines by default. Note that this can be changed during runtime                                                                                                                    |       0  |

## Webpack Related Configs

| Variables                      | Description                                                                                                                                                                                                                                                                                                        |    Default    |
| ------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----------: |
| `ELECTRODE_DEV_OPEN_BROWSER`   | When using dev middleware, `clap dev` can automatically open your app in the browser. Use this flag to control that behavior <br> Set to `false` - completely disable auto opening in browser.<br> Set to `true` - Always auto open.<br> Unset - automatically open if it didn't do so within the last 10 minutes. |    `false`    |
| `CSS_MODULE_SUPPORT`           | If `false`, then disable `CSS-Modules` and `CSS-Next` support, and load as pure `CSS`. If `true`, then enable `CSS-Modules` and `CSS-Next` support, and load as `CSS-Modules + CSS-Next`                                                                                                                           |  `undefined`  |
| `ENABLE_BABEL_POLYFILL`        | If `true`, loads `core-js` polyfill automatically for your bundle                                                                                                                                                                                                                                                  |    `false`    |
| `ENABLE_NODESOURCE_PLUGIN`     | If `true`, automatically bundles modules for compatibility with NodeJS internal modules<br><br>Note: enabling this will make webpack bundle more than 100K of JS to simulate a NodeJS environment                                                                                                                  |    `false`    |
| `WOFF_FONT_INLINE_LIMIT`       | Size limit to turn off inlining WOFF font                                                                                                                                                                                                                                                                          | `1000`(bytes) |
| `WEBPACK_PRESERVE_SYMLINKS`    | If `true`, preserves symlink paths in resolve modules.<br>If this is not defined, then the env [`NODE_PRESERVE_SYMLINKS`] will be considered                                                                                                                                                                       |    `false`    |
| `ENABLE_SHORTEN_CSS_NAMES`     | When using CSS module, you can create short and cryptic CSS class names in production mode by setting this flag to `true`                                                                                                                                                                                          |    `false`    |
| `WEBPACK_DEV_ARTIFACTS_PATH`   | specify path to the copy of some static files in dev mode                                                                                                                                                                                                                                                          |   `".etmp"`   |
| `WEBPACK_HOT_MODULE_RELOAD`    | If `true`, enable hot module reload                                                                                                                                                                                                                                                                                |    `true`     |
| `WEBPACK_DEV_WARNINGS_OVERLAY` | If `true`, shows warnings on a full-screen overlay in the browser in addition to compiler errors                                                                                                                                                                                                                   |    `true`     |
| `ELECTRODE_LOAD_DLLS`          | If non empty json, each entry is the name of Electrode Webpack DLL to be loaded by the app                                                                                                                                                                                                                         |     `{}`      |
| `WEBPACK_MINIFY`               | If `true`, webpack in `development` mode to minify code                                                                                                                                                                                                                                                            |    `true`     |

- The following settings are used by the Webpack dev middleware server to determine the host and port. The Electrode dev reverse proxy will automatically reconfigure itself to use overridden values:

| Variable           | Description                                                |   Default   |
| ------------------ | :--------------------------------------------------------- | :---------: |
| `WEBPACK_DEV_HOST` | If defined, used as the hostname for webpack dev server    | `localhost` |
| `WEBPACK_DEV_PORT` | If defined, used as the port number for webpack dev server |   `2992`    |

## Babel Related Configs

| Variable                  | Description                                                                                                                                                                                                                                               |                             Default                             |
| ------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------: |
| `ENABLE_BABEL_TYPESCRIPT` | If `true`, enable typescript support                                                                                                                                                                                                                      |                             `false`                             |
| `ENABLE_BABEL_FLOW`       | If `true`, enable FlowJS type stripping                                                                                                                                                                                                                   |                             `true`                              |
| `FLOW_REQUIRE_DIRECTIVE`  | If `true`, **only** strip annotations and declarations from files that contain `// @flow` directive. <br><br>Work as `requireDirective` option of `@babel/plugin-transform-flow-strip-types`                                                              |                             `false`                             |
| `BABEL_CLASS_PROPS`       | If `true`, allow class properties                                                                                                                                                                                                                         |                             `false`                             |
| `BABEL_CLASS_PROPS_LOOSE` | If `true`, compile class properties to assignment expression instead of `Object.defineProperty`. Work as `loose` option of `@babel/plugin-proposal-class-properties`                                                                                      |                             `true`                              |
| `BABEL_ENV_TARGETS`       | specify multiple environment targets for babel preset env to build `dist` bundle. `default` and `node` targets objects are required                                                                                                                       | `{default: {ie: "8"},node:process.versions.node.split(".")[0]}` |
| `ENV_TARGET`              | specify a `targets` object within `BABEL_ENV_TARGETS` by name that babel will use to build `dist-X` bundle<br><br>Note: the default bundle generated is `dist`, while other specified bundle for example `ENV_TARGET=es6` will be generated in `dist-es6` |                           `"default"`                           |

## Karma Related

| Variable        | Description                                                                    | Default  |
| --------------- | :----------------------------------------------------------------------------- | :------: |
| `KARMA_BROWSER` | Set the browser karma will use<br>`chrome` - Chrome<br>`phantomjs` - PhantomJS | `chrome` |

[`node_preserve_symlinks`]: https://nodejs.org/docs/latest-v8.x/api/cli.html#cli_node_preserve_symlinks_1
