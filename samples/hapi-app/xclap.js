/*
 * Tell Electrode app archetype that you want to use ES6 syntax in your server code
 */

process.env.SERVER_ES6 = true;

// Run app server at port 3100 to enable dev proxy at port 3000
process.env.APP_SERVER_PORT = 3100;

/*
 * Tell Electrode app archetype that you want to use webpack dev as a middleware
 * This will run webpack dev server as part of your app server.
 */

process.env.WEBPACK_DEV_MIDDLEWARE = true;

process.env.USE_APP_WEBPACK_CONFIG = true;

/*
 * Tell Electrode app archetype that you want to shorten css names under production env
 */

process.env.ENABLE_SHORTEN_CSS_NAMES = true;

/*
 * Enable webpack's NodeSourcePlugin to simulate NodeJS libs in browser
 *
 * This basically adds a bunch of extra JavaScript to the browser to simulate
 * some NodeJS modules like `process`, `console`, `Buffer`, and `global`.
 *
 * Docs here:
 * https://github.com/webpack/docs/wiki/internal-webpack-plugins#nodenodesourcepluginoptions
 *
 * Note that the extra JavaScript could be substantial and adds more than 100K
 * of minified JS to your browser bundle.
 *
 * But if you see Errors like "Uncaught ReferenceError: global is not defined", then
 * the quick fix is to uncomment the line below.
 */

// process.env.ENABLE_NODESOURCE_PLUGIN = true;

/*
 * Use PhantomJS to run your Karma Unit tests.  Default is "chrome" (Chrome Headless)
 */

// process.env.KARMA_BROWSER = "phantomjs";

const { getDevTaskRunner, loadXarcDevTasks } = require("@xarc/app-dev/lib/dev-tasks");

const runner = getDevTaskRunner();
runner.load({
  foo: runner.exec("echo hello from foo task")
});

loadXarcDevTasks();

//
