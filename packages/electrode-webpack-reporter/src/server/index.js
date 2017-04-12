"use strict";
global.navigator = { userAgent: false };

process.on("SIGINT", () => {
  process.exit(0);
});

const staticPathsDecor = require("electrode-static-paths");
const supports = require("electrode-archetype-react-app/supports");
const statsUtils = require("../../lib/stats-utils");
const electrodeServer = require("electrode-server")
const confippet = require("electrode-confippet");
const WebpackReporter = require("../../lib/webpack-reporter");

supports.load()
  .then(() => electrodeServer(confippet.config, [staticPathsDecor()]))
  .then((server) => {

    const app = function () { }
    app.get = (path, cb) => {
      server.route({
        method: "GET",
        path,
        handler: (req, reply) => {
          const res = function () { };
          res.json = (data) => reply(data), res;
          res.send = (data) => reply(data), res;
          return cb(req, res);
        }
      });
    };

    const reporter = new WebpackReporter({
      skipReportRoutes: process.env.NODE_ENV !== "production",
      skipSocket: true
    });

    const reporterOptions = {
      state: true,
      stats: {
        hasWarnings: () => true,
        hasErrors: () => true,
        toJson: () => require("./stats_err.json") // eslint-disable-line
      },
      options: {
        host: "localhost",
        port: 3000
      }
    }

    const config = {};

    reporter.apply(config);
    config.setup(app);
    config.reporter(reporterOptions);
  });
