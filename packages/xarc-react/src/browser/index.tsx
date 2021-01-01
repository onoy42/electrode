// import { ReactLib } from "./react-lib";
import { declareSubApp as dsa, SubAppDef, SubAppOptions, SubAppFeatureFactory } from "@xarc/subapp";
import { __createDynamicComponent, CreateComponentOptions } from "../common/create-component";
import { BrowserReactLib } from "./react-lib-browser";
import { __reactFrameworkFeature, __addFeature } from "../common";
import { appContextFeature } from "./feat-app-context-browser";
//
// re-exports
//
export * from "../common";
export * from "./feat-static-props-browser";
export { appContextFeature };

/**
 * Add React framework feature to a subapp (browser version)
 *
 * This is added as default if you use `declareSubApp` or `createDynamicComponent` from `@xarc/react`
 */
export function reactFrameworkFeature(): SubAppFeatureFactory {
  return __reactFrameworkFeature((...args) => new BrowserReactLib(...args));
}

/**
 * declare a subapp to use React framework (browser version)
 *
 * @param options - subapp options
 */
function __declareSubApp(options: SubAppOptions): SubAppDef {
  // add framework feature if it's not exist
  let opts = __addFeature(options, "framework", reactFrameworkFeature);
  opts = __addFeature(opts, "app-context-provider", appContextFeature);
  return dsa(opts);
}

export { __declareSubApp as declareSubApp };

/**
 * create a dynamic component for the React framework (browser version)
 *
 * @param optDef - SubAppOptions or SubAppDef
 * @param options - create component options
 *
 * @returns a React component that will be dynamic import
 */
export function createDynamicComponent(
  optDef: SubAppDef | SubAppOptions,
  options: CreateComponentOptions = {}
) {
  return __createDynamicComponent(optDef, options, __declareSubApp);
}
