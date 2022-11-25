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
  FragmentStoreBackwardCursor: () => FragmentStoreBackwardCursor,
  FragmentStoreForwardCursor: () => FragmentStoreForwardCursor,
  FragmentStoreOffset: () => FragmentStoreOffset
});
module.exports = __toCommonJS(fragment_exports);
var import_config = require("$houdini/runtime/lib/config");
var import_constants = require("$houdini/runtime/lib/constants");
var import_types = require("$houdini/runtime/lib/types");
var import_store = require("svelte/store");
var import_store2 = require("../store");
var import_cursor = require("./cursor");
var import_offset = require("./offset");
var import_pageInfo = require("./pageInfo");
class BasePaginatedFragmentStore extends import_store2.BaseStore {
  paginated = true;
  paginationArtifact;
  name;
  kind = import_types.CompiledFragmentKind;
  constructor(config) {
    super();
    this.paginationArtifact = config.paginationArtifact;
    this.name = config.storeName;
  }
  async queryVariables(store) {
    const config = await (0, import_config.getCurrentConfig)();
    const { targetType } = this.paginationArtifact.refetch || {};
    const typeConfig = config.types?.[targetType || ""];
    if (!typeConfig) {
      throw new Error(
        `Missing type refetch configuration for ${targetType}. For more information, see ${import_constants.siteURL}/guides/pagination#paginated-fragments`
      );
    }
    let idVariables = {};
    const value = (0, import_store.get)(store).data;
    if (typeConfig.resolve?.arguments) {
      idVariables = typeConfig.resolve.arguments?.(value) || {};
    } else {
      const keys = (0, import_config.keyFieldsForType)(config, targetType || "");
      idVariables = Object.fromEntries(keys.map((key) => [key, value[key]]));
    }
    return {
      ...idVariables
    };
  }
}
class FragmentStoreCursor extends BasePaginatedFragmentStore {
  get(initialValue) {
    const store = (0, import_store.writable)({
      data: initialValue,
      isFetching: false,
      pageInfo: (0, import_pageInfo.nullPageInfo)()
    });
    const loading = (0, import_store.writable)(false);
    const handlers = this.storeHandlers(store, loading.set);
    const subscribe = (run, invalidate) => {
      const combined = (0, import_store.derived)(
        [store, handlers.pageInfo],
        ([$parent, $pageInfo]) => ({
          ...$parent,
          pageInfo: $pageInfo
        })
      );
      return combined.subscribe(run, invalidate);
    };
    return {
      kind: import_types.CompiledFragmentKind,
      data: store,
      subscribe,
      loading,
      fetch: handlers.fetch,
      pageInfo: handlers.pageInfo
    };
  }
  storeHandlers(store, setFetching) {
    return (0, import_cursor.cursorHandlers)({
      artifact: this.paginationArtifact,
      fetch: async () => {
        return {};
      },
      getValue: () => (0, import_store.get)(store).data,
      queryVariables: () => this.queryVariables(store),
      setFetching,
      storeName: this.name,
      getConfig: () => this.getConfig()
    });
  }
}
class FragmentStoreForwardCursor extends FragmentStoreCursor {
  get(initialValue) {
    const parent = super.get(initialValue);
    const handlers = this.storeHandlers(
      parent,
      parent.loading.set
    );
    return {
      ...parent,
      loadNextPage: handlers.loadNextPage
    };
  }
}
class FragmentStoreBackwardCursor extends FragmentStoreCursor {
  get(initialValue) {
    const parent = super.get(initialValue);
    const handlers = this.storeHandlers(
      parent,
      (isFetching) => parent.data.update((p) => ({ ...p, isFetching }))
    );
    return {
      ...parent,
      loadPreviousPage: handlers.loadPreviousPage
    };
  }
}
class FragmentStoreOffset extends BasePaginatedFragmentStore {
  get(initialValue) {
    const parent = (0, import_store.writable)({
      data: initialValue,
      isFetching: false
    });
    const handlers = (0, import_offset.offsetHandlers)({
      artifact: this.paginationArtifact,
      fetch: async () => ({}),
      getValue: () => (0, import_store.get)(parent).data,
      setFetching: (isFetching) => parent.update((p) => ({ ...p, isFetching })),
      queryVariables: () => this.queryVariables({ subscribe: parent.subscribe }),
      storeName: this.name,
      getConfig: () => this.getConfig()
    });
    return {
      ...parent,
      kind: import_types.CompiledFragmentKind,
      fetch: handlers.fetch,
      loadNextPage: handlers.loadNextPage
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FragmentStoreBackwardCursor,
  FragmentStoreForwardCursor,
  FragmentStoreOffset
});
