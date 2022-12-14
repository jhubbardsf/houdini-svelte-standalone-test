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
var adapter_exports = {};
__export(adapter_exports, {
  clientStarted: () => clientStarted,
  error: () => error,
  isBrowser: () => isBrowser,
  isPrerender: () => isPrerender,
  setClientStarted: () => setClientStarted
});
module.exports = __toCommonJS(adapter_exports);
const isBrowser = true;
let clientStarted = true;
let isPrerender = false;
const error = (code, message) => message;
function setClientStarted() {
  clientStarted = true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clientStarted,
  error,
  isBrowser,
  isPrerender,
  setClientStarted
});
