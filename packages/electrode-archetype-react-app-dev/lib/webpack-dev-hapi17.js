"use strict";

/* eslint-disable no-console, no-magic-numbers */

const Url = require("url");
const Boom = require("boom");
const mime = require("mime");
const archetype = require("electrode-archetype-react-app/config/archetype");

const Middleware = require("./webpack-middleware");
const FakeRes = require("./fake-res");

function register(server) {
  if (!archetype.webpack.devMiddleware) {
    console.error(
      "webpack-dev-hapi plugin was loaded but WEBPACK_DEV_MIDDLEWARE is not true. Skipping."
    );
    return;
  }

  const middleware = new Middleware({
    baseUrl: () => {
      return Url.format({
        hostname: process.env.HOST || "localhost",
        protocol: server.info.protocol,
        port: server.info.port
      });
    }
  });

  middleware.setup();

  server.ext({
    type: "onRequest",
    method: (request, h) => {
      const { req, res } = request.raw;

      const procResult = middleware.process(req, res, {
        skip: () => h.continue, // skip middleware and continue request cycle
        replyHtml: html => {
          return h
            .response(`<!DOCTYPE html>${html}`)
            .code(200)
            .header("Content-Type", "text/html");
        },
        replyNotFound: () => h.response(Boom.notFound),
        replyError: err => h.response(err),
        replyStaticData: data => {
          const type = mime.lookup(req.url);
          const resp = h.response(data).code(200);
          if (type) {
            const charset = mime.charsets.lookup(type);
            resp.header("Content-Type", type + (charset ? `; charset=${charset}` : ""));
          }
        },
        replyFile: name => h.file(name)
      });

      if (procResult !== middleware.canContinue) {
        return h.continue;
      }

      request.app.webpackDev = middleware.webpackDev;

      // simulate a res to capture what the devMiddleware might send back
      const fakeRes = new FakeRes();

      return middleware
        .devMiddleware(req, fakeRes, () => {
          return Promise.resolve(middleware.canContinue);
        })
        .then(next => {
          if (next === middleware.canContinue) {
            return h.continue;
          } else {
            // send back result from fakeRes
            const response = h.response(fakeRes._content).takeover();
            Object.keys(fakeRes._headers).forEach(key => {
              response.header(key, fakeRes._headers[key]);
            });
            return response.code(fakeRes.statusCode);
          }
        })
        .catch(err => {
          console.error("webpack dev middleware error", err);
          return h.response(err);
        });
    }
  });

  server.ext({
    type: "onRequest",
    method: (request, h) => {
      const { req, res } = request.raw;

      try {
        return middleware.hotMiddleware(req, res, err => {
          if (err) {
            console.error("webpack hot middleware error", err);
            return h.response(err);
          } else {
            return h.continue;
          }
        });
      } catch (err) {
        console.error("caught webpack hot middleware exception", err);
        return h.response(err);
      }
    }
  });

  return;
}

module.exports = register;
