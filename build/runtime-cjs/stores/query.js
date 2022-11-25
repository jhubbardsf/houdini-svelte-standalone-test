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
var query_exports = {};
__export(query_exports, {
  QueryStore: () => QueryStore,
  fetchParams: () => fetchParams
});
module.exports = __toCommonJS(query_exports);
var import_runtime = require("$houdini/runtime");
var import_deepEquals = require("$houdini/runtime/lib/deepEquals");
var log = __toESM(require("$houdini/runtime/lib/log"), 1);
var import_network = require("$houdini/runtime/lib/network");
var import_scalars = require("$houdini/runtime/lib/scalars");
var import_types = require("$houdini/runtime/lib/types");
var import_store = require("svelte/store");
var import_adapter = require("../adapter");
var import_network2 = require("../network");
var import_session = require("../session");
var import_store2 = require("./store");
class QueryStore extends import_store2.BaseStore {
  artifact;
  variables;
  kind = import_types.CompiledQueryKind;
  store;
  lastVariables = null;
  subscriptionSpec = null;
  loadPending = false;
  subscriberCount = 0;
  storeName;
  setFetching(isFetching) {
    this.store?.update((s) => ({ ...s, isFetching }));
  }
  async currentVariables() {
    return (0, import_store.get)(this.store).variables;
  }
  constructor({ artifact, storeName, variables }) {
    super();
    this.store = (0, import_store.writable)(this.initialState);
    this.artifact = artifact;
    this.storeName = storeName;
    this.variables = variables;
  }
  async fetch(args) {
    const config = await this.getConfig();
    const { policy, params, context } = await fetchParams(this.artifact, this.storeName, args);
    const isLoadFetch = Boolean("event" in params && params.event);
    const isComponentFetch = !isLoadFetch;
    const input = await (0, import_scalars.marshalInputs)({
      artifact: this.artifact,
      input: params?.variables
    }) || {};
    const newVariables = {
      ...this.lastVariables,
      ...input
    };
    let variableChange = !(0, import_deepEquals.deepEquals)(this.lastVariables, newVariables);
    if (variableChange && import_adapter.isBrowser) {
      this.refreshSubscription(newVariables);
      this.store.update((s) => ({ ...s, variables: newVariables }));
    }
    if (this.loadPending && isComponentFetch) {
      log.error(`\u26A0\uFE0F Encountered fetch from your component while ${this.storeName}.load was running.
This will result in duplicate queries. If you are trying to ensure there is always a good value, please a CachePolicy instead.`);
      return (0, import_store.get)(this.store);
    }
    if (isComponentFetch) {
      params.blocking = true;
    }
    if (isLoadFetch) {
      this.loadPending = true;
    }
    const fetchArgs = {
      config,
      context,
      artifact: this.artifact,
      variables: newVariables,
      store: this.store,
      cached: policy !== import_types.CachePolicy.NetworkOnly,
      setLoadPending: (val) => {
        this.loadPending = val;
        this.setFetching(val);
      }
    };
    const fakeAwait = import_adapter.clientStarted && import_adapter.isBrowser && !params?.blocking;
    if (policy !== import_types.CachePolicy.NetworkOnly && fakeAwait) {
      const cachedStore = await this.fetchAndCache({
        ...fetchArgs,
        rawCacheOnlyResult: true
      });
      if (cachedStore && cachedStore?.result.data) {
        this.store.update((s) => ({
          ...s,
          data: cachedStore?.result.data,
          isFetching: false
        }));
      }
    }
    const request = this.fetchAndCache(fetchArgs);
    if (params.then) {
      request.then((val) => params.then?.(val.result.data));
    }
    if (!fakeAwait) {
      await request;
    }
    return (0, import_store.get)(this.store);
  }
  get name() {
    return this.artifact.name;
  }
  subscribe(...args) {
    const bubbleUp = this.store.subscribe(...args);
    this.subscriberCount = (this.subscriberCount ?? 0) + 1;
    if (import_adapter.isBrowser && !this.subscriptionSpec) {
      this.refreshSubscription(this.lastVariables ?? {});
    }
    return () => {
      this.subscriberCount--;
      if (this.subscriberCount <= 0) {
        if (import_adapter.isBrowser && this.subscriptionSpec) {
          (0, import_runtime.getCache)().unsubscribe(this.subscriptionSpec, this.lastVariables || {});
        }
        this.subscriptionSpec = null;
      }
      bubbleUp();
    };
  }
  async fetchAndCache({
    config,
    artifact,
    variables,
    store,
    cached,
    ignoreFollowup,
    setLoadPending,
    policy,
    context,
    rawCacheOnlyResult = false
  }) {
    const request = await (0, import_network.fetchQuery)({
      ...context,
      client: await (0, import_network2.getCurrentClient)(),
      setFetching: (val) => this.setFetching(val),
      artifact,
      variables,
      cached,
      policy: rawCacheOnlyResult ? import_types.CachePolicy.CacheOnly : policy,
      context
    });
    const { result, source, partial } = request;
    if (rawCacheOnlyResult) {
      return request;
    }
    setLoadPending(false);
    if (result.data && source !== import_types.DataSource.Cache) {
      (0, import_runtime.getCache)().write({
        selection: artifact.selection,
        data: result.data,
        variables: variables || {}
      });
    }
    const unmarshaled = source === import_types.DataSource.Cache ? result.data : (0, import_scalars.unmarshalSelection)(config, artifact.selection, result.data);
    if (result.errors && result.errors.length > 0) {
      store.update((s) => ({
        ...s,
        errors: result.errors,
        isFetching: false,
        partial: false,
        data: unmarshaled,
        source,
        variables
      }));
      if (!config.plugins?.["houdini-svelte"]?.quietQueryErrors) {
        throw (0, import_adapter.error)(500, result.errors.map((error2) => error2.message).join(". ") + ".");
      }
    } else {
      store.set({
        data: unmarshaled || {},
        variables: variables || {},
        errors: null,
        isFetching: false,
        partial: request.partial,
        source: request.source
      });
    }
    if (!ignoreFollowup) {
      if (source === import_types.DataSource.Cache && artifact.policy === import_types.CachePolicy.CacheAndNetwork) {
        this.fetchAndCache({
          config,
          context,
          artifact,
          variables,
          store,
          cached: false,
          ignoreFollowup: true,
          setLoadPending,
          policy
        });
      }
      if (partial && artifact.policy === import_types.CachePolicy.CacheOrNetwork) {
        this.fetchAndCache({
          config,
          context,
          artifact,
          variables,
          store,
          cached: false,
          ignoreFollowup: true,
          setLoadPending,
          policy
        });
      }
    }
    return request;
  }
  refreshSubscription(newVariables) {
    const cache = (0, import_runtime.getCache)();
    if (this.subscriptionSpec) {
      cache.unsubscribe(this.subscriptionSpec, this.lastVariables || {});
    }
    this.subscriptionSpec = {
      rootType: this.artifact.rootType,
      selection: this.artifact.selection,
      variables: () => newVariables,
      set: (newValue) => this.store.update((s) => ({ ...s, data: newValue }))
    };
    cache.subscribe(this.subscriptionSpec, newVariables);
    this.lastVariables = newVariables;
  }
  get initialState() {
    return {
      data: null,
      errors: null,
      isFetching: true,
      partial: false,
      source: null,
      variables: {},
      ...this.extraFields()
    };
  }
  extraFields() {
    return {};
  }
}
async function fetchParams(artifact, storeName, params) {
  if (!import_adapter.isBrowser && !(params && "fetch" in params) && (!params || !("event" in params))) {
    log.error(contextError(storeName));
    throw new Error("Error, check above logs for help.");
  }
  let policy = params?.policy;
  if (!policy) {
    policy = artifact.policy ?? import_types.CachePolicy.CacheOrNetwork;
  }
  let fetchFn = null;
  if (params) {
    if ("fetch" in params && params.fetch) {
      fetchFn = params.fetch;
    } else if ("event" in params && params.event && "fetch" in params.event) {
      fetchFn = params.event.fetch;
    }
  }
  if (!fetchFn) {
    fetchFn = globalThis.fetch.bind(globalThis);
  }
  let session = void 0;
  if (params && "event" in params && params.event) {
    session = await (0, import_session.getSession)(params.event);
  } else if (import_adapter.isBrowser) {
    session = await (0, import_session.getSession)();
  } else {
    log.error(contextError(storeName));
    throw new Error("Error, check above logs for help.");
  }
  return {
    context: {
      fetch: fetchFn,
      metadata: params?.metadata ?? {},
      session
    },
    policy,
    params: params ?? {}
  };
}
const contextError = (storeName) => `
	${log.red(`Missing event args in load function`)}.

Please remember to pass event to fetch like so:

import type { LoadEvent } from '@sveltejs/kit';

export async function load(${log.yellow("event")}: LoadEvent) {
	return {
		...load_${storeName}({ ${log.yellow("event")}, variables: { ... } })
	};
}
`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryStore,
  fetchParams
});
