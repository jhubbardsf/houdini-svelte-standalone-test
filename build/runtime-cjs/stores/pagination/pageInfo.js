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
var pageInfo_exports = {};
__export(pageInfo_exports, {
  countPage: () => countPage,
  extractPageInfo: () => extractPageInfo,
  missingPageSizeError: () => missingPageSizeError,
  nullPageInfo: () => nullPageInfo
});
module.exports = __toCommonJS(pageInfo_exports);
var import_constants = require("$houdini/runtime/lib/constants");
function nullPageInfo() {
  return { startCursor: null, endCursor: null, hasNextPage: false, hasPreviousPage: false };
}
function missingPageSizeError(fnName) {
  return {
    message: `${fnName} is missing the required page arguments. For more information, please visit this link: ${import_constants.siteURL}/guides/pagination`
  };
}
function extractPageInfo(data, path) {
  if (!data) {
    return {
      startCursor: null,
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
  let localPath = [...path];
  let current = data;
  while (localPath.length > 0) {
    if (!current) {
      break;
    }
    current = current[localPath.shift()];
  }
  return current?.pageInfo ?? nullPageInfo();
}
function countPage(source, value) {
  let data = value;
  if (value === null || data === null || data === void 0) {
    return 0;
  }
  for (const field of source) {
    const obj = data[field];
    if (obj && !Array.isArray(obj)) {
      data = obj;
    } else if (!data) {
      throw new Error("Could not count page size");
    }
    if (Array.isArray(obj)) {
      return obj.length;
    }
  }
  return 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  countPage,
  extractPageInfo,
  missingPageSizeError,
  nullPageInfo
});
