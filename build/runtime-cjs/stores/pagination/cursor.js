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
var cursor_exports = {};
__export(cursor_exports, {
  cursorHandlers: () => cursorHandlers
});
module.exports = __toCommonJS(cursor_exports);
var import_runtime = require("$houdini/runtime");
var import_constants = require("$houdini/runtime/lib/constants");
var import_deepEquals = require("$houdini/runtime/lib/deepEquals");
var import_network = require("$houdini/runtime/lib/network");
var import_store = require("svelte/store");
var import_network2 = require("../../network");
var import_session = require("../../session");
var import_query2 = require("../query");
var import_pageInfo = require("./pageInfo");
function cursorHandlers({
  artifact,
  queryVariables: extraVariables,
  setFetching,
  fetch,
  storeName,
  getValue,
  getConfig
}) {
  const pageInfo = (0, import_store.writable)((0, import_pageInfo.extractPageInfo)(getValue(), artifact.refetch.path));
  const loadPage = async ({
    pageSizeVar,
    input,
    functionName,
    metadata = {},
    fetch: fetch2
  }) => {
    const config = await getConfig();
    const client = await (0, import_network2.getCurrentClient)();
    const loadVariables = {
      ...await extraVariables?.(),
      ...input
    };
    if (!loadVariables[pageSizeVar] && !artifact.refetch.pageSize) {
      throw (0, import_pageInfo.missingPageSizeError)(functionName);
    }
    const { result } = await (0, import_network.executeQuery)({
      client,
      artifact,
      variables: loadVariables,
      session: await (0, import_session.getSession)(),
      setFetching,
      cached: false,
      config,
      fetch: fetch2,
      metadata
    });
    const resultPath = [...artifact.refetch.path];
    if (artifact.refetch.embedded) {
      const { targetType } = artifact.refetch;
      if (!config.types?.[targetType]?.resolve) {
        throw new Error(
          `Missing type resolve configuration for ${targetType}. For more information, see ${import_constants.siteURL}/guides/pagination#paginated-fragments`
        );
      }
      resultPath.unshift(config.types[targetType].resolve.queryField);
    }
    pageInfo.set((0, import_pageInfo.extractPageInfo)(result.data, resultPath));
    (0, import_runtime.getCache)().write({
      selection: artifact.selection,
      data: result.data,
      variables: loadVariables,
      applyUpdates: true
    });
    setFetching(false);
  };
  return {
    loadNextPage: async ({
      first,
      after,
      fetch: fetch2,
      metadata
    } = {}) => {
      const currentPageInfo = (0, import_pageInfo.extractPageInfo)(getValue(), artifact.refetch.path);
      if (!currentPageInfo.hasNextPage) {
        return;
      }
      const input = {
        after: after ?? currentPageInfo.endCursor
      };
      if (first) {
        input.first = first;
      }
      return await loadPage({
        pageSizeVar: "first",
        functionName: "loadNextPage",
        input,
        fetch: fetch2,
        metadata
      });
    },
    loadPreviousPage: async ({
      last,
      before,
      fetch: fetch2,
      metadata
    } = {}) => {
      const currentPageInfo = (0, import_pageInfo.extractPageInfo)(getValue(), artifact.refetch.path);
      if (!currentPageInfo.hasPreviousPage) {
        return;
      }
      const input = {
        before: before ?? currentPageInfo.startCursor
      };
      if (last) {
        input.last = last;
      }
      return await loadPage({
        pageSizeVar: "last",
        functionName: "loadPreviousPage",
        input,
        fetch: fetch2,
        metadata
      });
    },
    pageInfo,
    async fetch(args) {
      const { params } = await (0, import_query2.fetchParams)(artifact, storeName, args);
      const { variables } = params ?? {};
      const extra = await extraVariables();
      const queryVariables = {
        ...extra,
        ...variables
      };
      if (variables && !(0, import_deepEquals.deepEquals)(extra, variables)) {
        const result2 = await fetch({
          ...params,
          then(data) {
            pageInfo.set((0, import_pageInfo.extractPageInfo)(data, artifact.refetch.path));
          }
        });
        return result2;
      }
      const count = (0, import_pageInfo.countPage)(artifact.refetch.path.concat("edges"), getValue()) || artifact.refetch.pageSize;
      if (count && count > artifact.refetch.pageSize) {
        queryVariables[artifact.refetch.update === "prepend" ? "last" : "first"] = count;
      }
      const result = await fetch({
        ...params,
        variables: queryVariables
      });
      pageInfo.set((0, import_pageInfo.extractPageInfo)(result.data, artifact.refetch.path));
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
  cursorHandlers
});
