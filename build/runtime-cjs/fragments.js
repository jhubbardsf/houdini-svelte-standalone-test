"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var fragments_exports = {};
__export(fragments_exports, {
  fragment: () => fragment,
  paginatedFragment: () => paginatedFragment
});
module.exports = __toCommonJS(fragments_exports);
var log = __toESM(require("$houdini/runtime/lib/log"), 1);
var import_types = require("$houdini/runtime/lib/types");
let hasWarned = false;
function fragment(ref, store) {
  const oldAPI = "kind" in (ref || {}) && Object.keys(import_types.ArtifactKind).includes(ref.kind);
  if (!hasWarned && oldAPI) {
    hasWarned = true;
    log.info(`${log.red(
      "\u26A0\uFE0F argument order for fragment() has changed. The graphql tag now goes second:"
    )}

export let prop

$: data = fragment(prop, graphql\`...\`)
`);
  }
  if (store.kind !== "HoudiniFragment") {
    throw new Error(`fragment can only take fragment documents. Found: ${store.kind}`);
  }
  const fragmentStore = store.get(ref);
  return {
    ...fragmentStore,
    data: { subscribe: fragmentStore.subscribe }
  };
}
function paginatedFragment(initialValue, store) {
  if (store.kind !== "HoudiniFragment") {
    throw new Error("paginatedFragment() must be passed a fragment document: " + store.kind);
  }
  if (!("paginated" in store)) {
    throw new Error("paginatedFragment() must be passed a fragment with @paginate");
  }
  return fragment(initialValue, store);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fragment,
  paginatedFragment
});
