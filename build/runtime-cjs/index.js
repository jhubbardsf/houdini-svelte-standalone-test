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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var runtime_exports = {};
__export(runtime_exports, {
  loadAll: () => loadAll
});
module.exports = __toCommonJS(runtime_exports);
__reExport(runtime_exports, require("./adapter"), module.exports);
__reExport(runtime_exports, require("./stores"), module.exports);
__reExport(runtime_exports, require("./fragments"), module.exports);
__reExport(runtime_exports, require("./session"), module.exports);
async function loadAll(...loads) {
  const promises = [];
  const isPromise = (val) => "then" in val && "finally" in val && "catch" in val;
  for (const entry of loads) {
    if (!isPromise(entry) && "then" in entry) {
      throw new Error("\u274C `then` is not a valid key for an object passed to loadAll");
    }
    if (isPromise(entry)) {
      promises.push(entry);
    } else {
      for (const [key, value] of Object.entries(entry)) {
        if (isPromise(value)) {
          promises.push(value);
        } else {
          throw new Error(
            `\u274C ${key} is not a valid value for an object passed to loadAll. You must pass the result of a load_Store function`
          );
        }
      }
    }
  }
  await Promise.all(promises);
  let result = {};
  for (const entry of loads) {
    if (isPromise(entry)) {
      Object.assign(result, await entry);
    } else {
      Object.assign(
        result,
        Object.fromEntries(
          await Promise.all(
            Object.entries(entry).map(async ([key, value]) => [
              key,
              Object.values(await value)[0]
            ])
          )
        )
      );
    }
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadAll
});
