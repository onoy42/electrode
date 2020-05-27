var path = require("path");
var archetype = require("@xarc/app/config/archetype")();
var archetypeEslint = path.join(archetype.config.eslint, ".eslintrc-react");

function dotify(p) {
  return path.isAbsolute(p) ? p : "." + path.sep + p;
}

module.exports = {
  extends: dotify(path.relative(__dirname, archetypeEslint)),
  env: {
    jest: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  }
};
