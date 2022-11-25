"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var fragment_exports = {};
__export(fragment_exports, {
  FragmentStore: () => FragmentStore
});
module.exports = __toCommonJS(fragment_exports);
var import_types = require("$houdini/runtime/lib/types");
var import_store = require("svelte/store");
var import_store2 = require("./store");
class FragmentStore extends import_store2.BaseStore {
  artifact;
  name;
  kind = import_types.CompiledFragmentKind;
  context = null;
  constructor({ artifact, storeName }) {
    super();
    this.artifact = artifact;
    this.name = storeName;
  }
  get(initialValue) {
    let store = (0, import_store.writable)(initialValue);
    return {
      kind: import_types.CompiledFragmentKind,
      subscribe: (...args) => {
        return store.subscribe(...args);
      },
      update: (val) => store?.set(val)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FragmentStore
});
