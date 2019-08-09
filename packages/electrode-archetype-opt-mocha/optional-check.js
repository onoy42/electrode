"use strict";

const Path = require("path");
const assert = require("assert");

const cwd = process.env.PWD || process.cwd();

function lookupAppDirByInitCwd() {
  let lookupDir = process.env.INIT_CWD;
  if (!lookupDir) return undefined;

  let count = 0;
  while (count < 100) {
    const pkgFile = Path.join(lookupDir, "package.json");
    try {
      require(pkgFile);
      return lookupDir;
    } catch (err) {
      //
    }

    const upDir = Path.join(lookupDir, "..");
    if (upDir === lookupDir) return undefined;
    lookupDir = upDir;
    count++;
  }

  return undefined;
}

function findAppDir() {
  if (cwd.indexOf("node_modules") > 0) {
    const splits = cwd.split("node_modules");
    return Path.dirname(Path.join(splits[0], "x")); // remove trailing slash
  }
  return cwd;
}

const appDir = lookupAppDirByInitCwd() || findAppDir();
const myPkg = require("./package.json");
if (cwd === appDir) {
  try {
    const appPkg = require(Path.join(appDir, "package.json"));
    if (myPkg.name === appPkg.name) {
      process.exit(0);
    }
  } catch (e) {
    //
  }
}

const name = myPkg.name;
const optParams = myPkg.electrodeOptArchetype || {};
assert(
  optParams.hasOwnProperty("optionalTagName"),
  "opt archetype ${name}: package.json missing electrodeOptArchetype.optionalTagName"
);
assert(
  optParams.hasOwnProperty("expectTag"),
  "opt archetype ${name}: package.json missing electrodeOptArchetype.expectTag"
);

const optionalTagName = optParams.optionalTagName;
const expectTag = optParams.expectTag;
const defaultInstall = Boolean(optParams.defaultInstall);
try {
  const config = require(Path.join(appDir, "archetype/config"));
  const options = (config && config.options) || {};
  if (!options.hasOwnProperty(optionalTagName) && defaultInstall === true) {
    process.exit(0);
  }

  const userConfig = options[optionalTagName];
  if (userConfig === expectTag) {
    console.log(`${name}: archetype config set ${optionalTagName} to ${userConfig} - installing`);
    process.exit(0);
  } else {
    console.log(
      `${name}: archetype config set ${optionalTagName} to ${userConfig} - skipping install because it's not ${expectTag}`
    );
  }
} catch (e) {
  if (defaultInstall === true) {
    process.exit(0);
  }
  console.log(`${name}: no archetype config found - skipping install`);
}

process.exit(1);
