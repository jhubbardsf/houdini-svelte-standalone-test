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
var offset_exports = {};
__export(offset_exports, {
  offsetHandlers: () => offsetHandlers
});
module.exports = __toCommonJS(offset_exports);
var import_runtime = require("$houdini/runtime");
var import_deepEquals = require("$houdini/runtime/lib/deepEquals");
var import_network = require("$houdini/runtime/lib/network");
var import_network2 = require("../../network");
var import_session = require("../../session");
var import_query2 = require("../query");
var import_pageInfo = require("./pageInfo");
function offsetHandlers({
  artifact,
  queryVariables: extraVariables,
  fetch,
  getValue,
  setFetching,
  storeName,
  getConfig
}) {
  let getOffset = () => artifact.refetch?.start || (0, import_pageInfo.countPage)(artifact.refetch.path, getValue()) || artifact.refetch.pageSize;
  let currentOffset = getOffset() ?? 0;
  return {
    loadNextPage: async ({
      limit,
      offset,
      fetch: fetch2,
      metadata
    } = {}) => {
      const config = await getConfig();
      offset ??= currentOffset || getOffset();
      const queryVariables = {
        ...await extraVariables(),
        offset
      };
      if (limit || limit === 0) {
        queryVariables.limit = limit;
      }
      if (!queryVariables.limit && !artifact.refetch.pageSize) {
        throw (0, import_pageInfo.missingPageSizeError)("loadNextPage");
      }
      const { result } = await (0, import_network.executeQuery)({
        client: await (0, import_network2.getCurrentClient)(),
        artifact,
        variables: queryVariables,
        session: await (0, import_session.getSession)(),
        cached: false,
        config,
        setFetching,
        fetch: fetch2,
        metadata
      });
      (0, import_runtime.getCache)().write({
        selection: artifact.selection,
        data: result.data,
        variables: queryVariables,
        applyUpdates: true
      });
      const pageSize = queryVariables.limit || artifact.refetch.pageSize;
      currentOffset = offset + pageSize;
      setFetching(false);
    },
    async fetch(args) {
      const { params } = await (0, import_query2.fetchParams)(artifact, storeName, args);
      const { variables } = params ?? {};
      const extra = await extraVariables();
      if (variables && !(0, import_deepEquals.deepEquals)(extra, variables)) {
        return fetch.call(this, params);
      }
      const count = currentOffset || getOffset();
      const queryVariables = {
        ...extra
      };
      if (!artifact.refetch.pageSize || count > artifact.refetch.pageSize) {
        queryVariables.limit = count;
      }
      const result = await fetch.call(this, {
        ...params,
        variables: queryVariables
      });
      setFetching(false);
      return {
        data: result.data,
        variables: queryVariables,
        isFetching: false,
        partial: result.partial,
        errors: null,
        source: result.source
      };
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  offsetHandlers
});
