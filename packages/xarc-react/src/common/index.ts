import * as React from "react";
import * as ReactDom from "react-dom";
import * as ReactDomServer from "react-dom/server";
import { FrameworkLib, SubAppOptions, SubApp, SubAppFeatureFactory, SubAppDef } from "@xarc/subapp";

export type ReactSubApp = SubApp<React.Component>;

//
// re-exports
//
export * from "@xarc/subapp";
export { React, ReactDom, ReactDomServer };
export { AppContext } from "./app-context";
export { CreateComponentOptions } from "./create-component";
export * from "./feat-static-props-types";
export * from "./feat-app-context-types";
/**
 * construct a framework feature for the implementation of FrameworkLib passed in
 *
 * @param __FrameWorkLib
 *
 * @returns framework feature
 */
export function __reactFrameworkFeature(factory: () => FrameworkLib): SubAppFeatureFactory {
  return {
    id: "framework",
    subId: "react",

    add: (subapp: SubAppDef) => {
      if (!subapp._frameworkFactory) {
        subapp._frameworkFactory = factory;
      }
      return subapp;
    }
  };
}

/**
 * add a feature to subapp options - internal use
 * @param options
 * @param id
 * @param featureProvider
 */
export function __addFeature(
  options: SubAppOptions,
  id: string,
  featureProvider: () => SubAppFeatureFactory
) {
  return options.wantFeatures && options.wantFeatures.find(x => x.id === id)
    ? options
    : {
        ...options,
        wantFeatures: [].concat(options.wantFeatures || [], featureProvider())
      };
}
