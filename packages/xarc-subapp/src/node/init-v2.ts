/* eslint-disable no-console, max-statements, global-require, @typescript-eslint/no-var-requires */

import * as Path from "path";
import { generateNonce, loadCdnMap, mapCdn, wrapStringFragment, urlJoin } from "./utils";
import { WebpackStats } from "./webpack-stats";
import * as Crypto from "crypto";
import { AssetPathMap, InitProps } from "./types";

/**
 * Initialize all the up front code required for running subapps in the browser.
 *
 * @param setupContext - context for setup
 * @param setupToken - token for setup
 * @returns data with template process callback
 */
export function initSubApp(setupContext: any, setupToken: Partial<{ props: InitProps }>) {
  const isProd = process.env.NODE_ENV === "production";
  const distDir = isProd
    ? Path.join(__dirname, "../../dist/min")
    : Path.join(__dirname, "../../dist-browser~es5~cjs~/browser");

  const getClientJs = (file: string, exportName: string) => {
    const code = require(Path.join(distDir, file))[exportName].toString();
    return `(${code})(window);
`;
  };

  const isWebpackDev = Boolean(process.env.WEBPACK_DEV);

  const props: InitProps = setupToken.props;

  const stats = new WebpackStats();
  stats.load();

  let pathMap: AssetPathMap;
  let cdnMap;

  if (isWebpackDev) {
    if (props.devAssetData) {
      pathMap = props.devAssetData.pathMap;
      cdnMap = props.devAssetData.cdnMap;
    }
  } else if (props.prodAssetData) {
    pathMap = props.prodAssetData.pathMap;
    cdnMap = props.prodAssetData.cdnMap;
  }

  if (!pathMap) {
    pathMap = { base: "/js" };
  }

  const cdnMapData = cdnMap && (typeof cdnMap === "string" ? loadCdnMap(cdnMap) : cdnMap);
  let cdnAsJsonScript = "";
  let cdnUpdateScript = "";
  if (cdnMapData) {
    const cdnMapJsonId = `cdn-map-${Crypto.randomBytes(8).toString("base64")}`;
    cdnAsJsonScript = `<script{{SCRIPT_NONCE}} type="application/json" id="${cdnMapJsonId}">
${JSON.stringify(cdnMapData)}
</script>
`;
    cdnUpdateScript = `window.xarcV2.cdnUpdate({md:window.xarcV2.dyn("${cdnMapJsonId}")})
`;
  }

  // client side JS code required to start subapps and load assets
  const webpack4JsonpJs = getClientJs("webpack4-jsonp.js", "webpack4JsonP");
  const xarcV2Js = getClientJs("xarc-subapp-v2.js", "xarcV2Client");
  const cdnMapScripts = !cdnMap ? "" : getClientJs("xarc-cdn-map.js", "xarcCdnMap");

  const getFileAssetPath = (file: string) => {
    const fromCdn = mapCdn(file, cdnMapData);
    if (fromCdn !== false) {
      return fromCdn;
    }

    const prefix = pathMap.base;
    const ext = pathMap[Path.extname(file)] || "";
    return urlJoin(prefix, ext, file);
  };

  const runtimeJsFiles = stats.getChunkAssetFilename("runtime", ".js");
  const runtimeJsScripts = wrapStringFragment(
    runtimeJsFiles
      .map((file: string) => `<script{{SCRIPT_NONCE}} src="${getFileAssetPath(file)}"></script>`)
      .join("\n"),
    "",
    "\n"
  );
  const mainJsFiles = stats.getChunkAssetFilename("main", ".js");
  const mainJsScripts = wrapStringFragment(
    mainJsFiles
      .map((file: string) => `<script{{SCRIPT_NONCE}} src="${getFileAssetPath(file)}"></script>`)
      .join("\n"),
    "",
    "\n"
  );

  // const mainCssFiles = stats.getChunkAssetFilename("main", ".css");
  // const mainCssLink =
  //   mainCssFiles.length < 1
  //     ? ""
  //     : mainCssFiles.map(file => `<link rel="stylesheet" href="${getFileAssetPath(file)}" />`);

  //
  // TODO: only preload CSS for subapp chunks that has SSR
  //
  const allCssLinks = wrapStringFragment(
    stats.allChunkNames
      .map(chunkName => {
        const links = stats.getChunkAssetFilename(chunkName, ".css").map(cssFile => {
          return `<link{{STYLE_NONCE}} rel="stylesheet" href="${getFileAssetPath(cssFile)}" />`;
        });
        return wrapStringFragment(links.join(""), `<!-- CSS for chunk ${chunkName} -->`);
      })
      .filter(x => x)
      .join("\n"),
    "",
    "\n<!-- End of CSS loading -->\n"
  );

  return {
    process(context) {
      const { attr: scriptNonceAttr, nonce: scriptNonce } = generateNonce(
        setupToken,
        null,
        "script"
      );
      const { attr: styleNonceAttr, nonce: styleNonce } = generateNonce(
        setupToken,
        scriptNonce,
        "style"
      );

      if (!context.user) {
        context.user = {};
      }

      context.user.request = context.options.request;
      context.user.scriptNonce = scriptNonce;
      context.user.scriptNonceAttr = scriptNonceAttr;
      context.user.styleNonce = styleNonce;
      context.user.styleNonceAttr = styleNonceAttr;

      const cspValues = [];
      const setCspNonce = (nonce, tag) => {
        if (nonce) {
          const { tokens } = nonce;
          const token = tokens[tag] || tokens.all;
          // strict-dynamic is required for webpack to load dynamic import bundles
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#strict-dynamic_2
          cspValues.push(`${tag}-src-elem 'strict-dynamic' 'nonce-${token}';`);
        }
      };

      setCspNonce(context.user.scriptNonce, "script");
      setCspNonce(context.user.styleNonce, "style");

      if (cspValues.length > 0) {
        context.user.cspHeader = cspValues.join(" ");
      }

      const addScriptNonce = (text: string) => {
        return text && text.replace(/{{SCRIPT_NONCE}}/g, scriptNonceAttr);
      };

      const addStyleNonce = (text: string) => {
        return text && text.replace(/{{STYLE_NONCE}}/g, styleNonceAttr);
      };

      return `
${addStyleNonce(allCssLinks)}${addScriptNonce(cdnAsJsonScript)}<script${scriptNonceAttr}>
// xarc client side support code
${webpack4JsonpJs}${xarcV2Js}${cdnMapScripts}// End of xarc client side support code
${cdnUpdateScript}</script>
${addScriptNonce(runtimeJsScripts)}${addScriptNonce(mainJsScripts)}`;
    }
  };
}
