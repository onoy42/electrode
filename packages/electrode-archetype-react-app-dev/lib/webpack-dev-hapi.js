"use strict";

/* eslint-disable no-console, no-magic-numbers */

const Url = require("url");
const Boom = require("boom");
const mime = require("mime");
const archetype = require("electrode-archetype-react-app/config/archetype");
const { universalHapiPlugin } = require("electrode-hapi-compat");
const hapi17Plugin = require("./webpack-dev-hapi17");

const Middleware = require("./webpack-middleware");
const FakeRes = require("./fake-res");

function register(server, options, next) {
  if (!archetype.webpack.devMiddleware) {
    console.error(
      "webpack-dev-hapi plugin was loaded but WEBPACK_DEV_MIDDLEWARE is not true. Skipping."
    );
    return next();
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
    method: (request, reply) => {
      const { req } = request.raw;

      // simulate a res to capture what the devMiddleware might send back
      const fakeRes = new FakeRes();

      middleware
        .process(req, fakeRes, {
          skip: () => reply.continue(), // skip middleware and continue request cycle
          replyHtml: html => {
            return reply(`<!DOCTYPE html>${html}`)
              .code(200)
              .header("Content-Type", "text/html");
          },
          replyNotFound: () => reply(Boom.notFound),
          replyError: err => reply(err),
          replyStaticData: data => {
            const type = mime.lookup(req.url);
            const resp = reply.response(data).code(200);
            if (type) {
              const charset = mime.charsets.lookup(type);
              return resp.header("Content-Type", type + (charset ? `; charset=${charset}` : ""));
            }
            return resp;
          },
          replyFile: name => reply.file(name)
        })
        .then(next1 => {
          if (fakeRes.responded) {
            return fakeRes.hapi16Respond(reply);
          }

          if (next1 !== middleware.canContinue) {
            return next1;
          }

          request.app.webpackDev = middleware.webpackDev;

          return middleware
            .devMiddleware(req, fakeRes, () => {
              return Promise.resolve(middleware.canContinue);
            })
            .then(() => {
              if (fakeRes.responded) {
                // send back result from fakeRes
                return fakeRes.hapi16Respond(reply);
              }

              return reply.continue();
            });
        })
        .catch(err => {
          console.error("webpack dev middleware error", err);
          reply(err);
        });
    }
  });

  server.ext({
    type: "onRequest",
    method: (request, reply) => {
      const { req, res } = request.raw;

      try {
        return middleware.hotMiddleware(req, res, err => {
          if (err) {
            console.error("webpack hot middleware error", err);
            reply(err);
          } else {
            reply.continue();
          }
        });
      } catch (err) {
        console.error("caught webpack hot middleware exception", err);
        reply(err);
      }

      return undefined;
    }
  });

  return next();
}

const registers = {
  hapi16: register,
  hapi17: hapi17Plugin
};
const pkg = {
  name: "electrode-webpack-dev-hapi",
  version: "1.0.0"
};

module.exports = universalHapiPlugin(registers, pkg);
