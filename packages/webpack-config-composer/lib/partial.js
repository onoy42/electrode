"use strict";

const _ = require("lodash");
const { getConcatMethod } = require("./concat-method");
const assert = require("assert");

const OVERRIDE = Symbol("override webpack config partial");
const DATA = Symbol("webpack partial data");

class Partial {
  constructor(name, data) {
    this._name = name;
    if (typeof data === "function") {
      this[DATA] = { config: data };
    } else {
      this[DATA] = Object.assign({ config: {}, options: {} }, data);
    }
    this.setOverride();
  }

  set config(config) {
    this[DATA].config = config;
  }

  get config() {
    return this[DATA].config;
  }

  set options(options) {
    this[DATA].options = Object.assign({}, options);
  }

  get options() {
    return this[DATA].options;
  }

  merge(data, concatArray) {
    _.mergeWith(this[DATA], data, getConcatMethod(concatArray));
  }

  setOverride(fn) {
    this[OVERRIDE] = fn || _.identity;
  }

  compose(options) {
    options = Object.assign({}, this.options, options);

    const config = this.config;
    const configType = typeof config;

    let ret;

    if (configType === "object") {
      ret = config;
    } else if (configType === "function") {
      ret = config(options);
      if (typeof ret === "function") {
        ret = ret(options);
      }
    } else {
      throw new Error(`can't process config from Partial ${this._name}`);
    }

    const override = this[OVERRIDE](ret, options);

    return override || ret;
  }
}

module.exports = Partial;
