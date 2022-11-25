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
var pagination_exports = {};
__export(pagination_exports, {
  FragmentStoreBackwardCursor: () => import_fragment.FragmentStoreBackwardCursor,
  FragmentStoreForwardCursor: () => import_fragment.FragmentStoreForwardCursor,
  FragmentStoreOffset: () => import_fragment.FragmentStoreOffset,
  QueryStoreBackwardCursor: () => import_query.QueryStoreBackwardCursor,
  QueryStoreForwardCursor: () => import_query.QueryStoreForwardCursor,
  QueryStoreOffset: () => import_query.QueryStoreOffset
});
module.exports = __toCommonJS(pagination_exports);
var import_fragment = require("./fragment");
var import_query = require("./query");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FragmentStoreBackwardCursor,
  FragmentStoreForwardCursor,
  FragmentStoreOffset,
  QueryStoreBackwardCursor,
  QueryStoreForwardCursor,
  QueryStoreOffset
});
