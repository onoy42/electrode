"use strict";

/* eslint-disable no-magic-numbers */

module.exports = () => {
  return {
    "user-token-1": () => {
      return "<div>user-token-1</div>";
    },

    "user-token-2": (context, next) => {
      context.output.add("<div>user-token-2</div>");
      next();
    },

    "user-spot-token": context => {
      const spot = context.output.reserve();
      spot.add("<div>user-spot-1;");
      setTimeout(() => {
        spot.add("user-spot-2;");
        setTimeout(() => {
          spot.add("user-spot-3</div>");
          spot.close();
        }, 20);
      }, 10);
    },

    "user-promise-token": context => {
      return new Promise(resolve => {
        setTimeout(() => {
          context.output.add("<div>user-promise-token</div>");
          resolve();
        }, 10);
      });
    },

    PAGE_TITLE: () => {
      return "<title>user-handler-title</title>";
    }
  };
};
