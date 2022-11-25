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
var query_exports = {};
__export(query_exports, {
  QueryStoreBackwardCursor: () => QueryStoreBackwardCursor,
  QueryStoreForwardCursor: () => QueryStoreForwardCursor,
  QueryStoreOffset: () => QueryStoreOffset
});
module.exports = __toCommonJS(query_exports);
var import_store = require("svelte/store");
var import_query = require("../query");
var import_cursor = require("./cursor");
var import_offset = require("./offset");
var import_pageInfo = require("./pageInfo");
class CursorPaginatedStore extends import_query.QueryStore {
  paginated = true;
  handlers;
  constructor(config) {
    super(config);
    this.handlers = (0, import_cursor.cursorHandlers)({
      artifact: this.artifact,
      fetch: super.fetch.bind(this),
      setFetching: this.setFetching.bind(this),
      queryVariables: this.currentVariables.bind(this),
      storeName: this.name,
      getValue: () => (0, import_store.get)(this.store).data,
      getConfig: () => this.getConfig()
    });
  }
  async fetch(args) {
    return this.handlers.fetch.call(this, args);
  }
  extraFields() {
    return {
      pageInfo: (0, import_pageInfo.nullPageInfo)()
    };
  }
  subscribe(run, invalidate) {
    const combined = (0, import_store.derived)(
      [{ subscribe: super.subscribe.bind(this) }, this.handlers.pageInfo],
      ([$parent, $pageInfo]) => ({
        ...$parent,
        pageInfo: $pageInfo
      })
    );
    return combined.subscribe(run, invalidate);
  }
}
class QueryStoreForwardCursor extends CursorPaginatedStore {
  async loadNextPage(args) {
    return this.handlers.loadNextPage(args);
  }
}
class QueryStoreBackwardCursor extends CursorPaginatedStore {
  async loadPreviousPage(args) {
    return this.handlers.loadPreviousPage(args);
  }
}
class QueryStoreOffset extends import_query.QueryStore {
  paginated = true;
  handlers;
  constructor(config) {
    super(config);
    this.handlers = (0, import_offset.offsetHandlers)({
      artifact: this.artifact,
      fetch: super.fetch,
      getValue: () => (0, import_store.get)(this.store).data,
      setFetching: (...args) => this.setFetching(...args),
      queryVariables: () => this.currentVariables(),
      storeName: this.name,
      getConfig: () => this.getConfig()
    });
  }
  async loadNextPage(args) {
    return this.handlers.loadNextPage.call(this, args);
  }
  fetch(args) {
    return this.handlers.fetch.call(this, args);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryStoreBackwardCursor,
  QueryStoreForwardCursor,
  QueryStoreOffset
});
